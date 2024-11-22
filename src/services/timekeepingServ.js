import { http } from './config';

export const timekeepingServ = {
  registerFace: (body) => {
    return http.put('/timekeeping/register-face', body);
  },
  checkIn: (employeeId, body) => {
    return http.post(`/timekeeping/check-in/${employeeId}`, body);
  },
  checkOut: (employeeId, body) => {
    return http.put(`/timekeeping/check-out/${employeeId}`, body);
  },
  checkTimekeeping: (employeeId) => {
    return http.get(`/timekeeping/check-timekeeping/${employeeId}`);
  },
  totalTimekeeping: (employeeId) => {
    return http.get(`/timekeeping/total-timekeeping/${employeeId}`);
  },
};
