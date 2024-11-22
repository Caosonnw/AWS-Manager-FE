import { http } from './config';

export const blogServ = {
  createPost: (formData) => {
    return http.post('/blog/create-post', formData);
  },
  getallPost: () => {
    return http.get('/blog/get-all-posts');
  },
};
