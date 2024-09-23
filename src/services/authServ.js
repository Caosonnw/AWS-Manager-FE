import { http } from './config';

export const authServ = {
  login: (model) => {
    return http.post('/auth/login', model);
  },
  signUp: (model) => {
    return http.post('/auth/sign-up', model);
  },
};
