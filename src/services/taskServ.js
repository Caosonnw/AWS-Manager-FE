import { http } from './config';

export const taskServ = {
  createNewTask: (data) => http.post('/tasks/create-new-task', data),
  getTasksByProject: (project_id) =>
    http.get(`/tasks/get-task-by-project/${project_id}`),
  updateTaskStatus: (taskId, newStatus) =>
    http.put('/tasks/update-task-status', { task_id: taskId, newStatus }),
  getTaskDetail: (task_id) => http.get(`/tasks/get-task-detail/${task_id}`),
};
