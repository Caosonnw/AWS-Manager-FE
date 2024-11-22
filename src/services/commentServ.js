import { http } from './config';

export const commentServ = {
  createCommentBlogId: (formData, blog_id) => {
    return http.post(`/comment/create-comment/${blog_id}`, formData);
  },
  getCommentBlogId: (blog_id) => {
    return http.get(`/comment/get-comment/${blog_id}`);
  },
};
