import axios from 'axios';

export const http = axios.create({
  baseURL: 'https://localhost:8080',
  timeout: 30000,
});
http.interceptors.request.use((config) => {
  const tokenLocal = localStorage.getItem('LOGIN_USER');
  if (tokenLocal) {
    try {
      config.headers.Authorization = `Bearer ${tokenLocal}`;
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  }
  return config;
});

// handlê refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        http
          .post(`/auth/reset-token`)
          .then(async ({ data }) => {
            await Promise.all([localStorage.setItem('LOGIN_USER', data.data)]);
            processQueue(null, data.data);
            originalRequest.headers['Authorization'] = 'Bearer ' + data.data;
            resolve(axios(originalRequest));
          })
          .catch((err) => {
            console.log(err);
            // TODO: if refresh error to logout
            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);
