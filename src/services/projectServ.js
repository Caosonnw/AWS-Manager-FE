import { http } from './config';

export const projectServ = {
  createProject: (data) => http.post('/project/create-project', data),
  getAllProjects: () => http.get('/project/get-all-projects'),
  addMemberToProject: (projectId, memberId) =>
    http.post(`/project/${projectId}/members/${memberId}`, {
      member_id: memberId,
    }),
};
