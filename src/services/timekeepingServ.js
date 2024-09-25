import { http } from './config';

export const timekeepingServ = {
  registerFace: (body) => {
    return http.put('/timekeeping/register-face', body);
  },
};
