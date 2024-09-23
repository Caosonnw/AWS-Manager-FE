import { http } from './config';

export const employeeServ = {
  getAllEmployees: () => {
    return http.get('/employee/get-all-employees');
  },
  getEmployeeById: (employee_id) => {
    return http.get(`/employee/get-employee-by-id/${employee_id}`);
  },
  
};
