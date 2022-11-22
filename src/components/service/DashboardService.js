import axios from "axios";
import instance from '../instance/instance';


const DashboardService = {
  getWorkingTasksPageable: (page, pageSize, employeeTrackingFilter) => {
    const role = localStorage.getItem("ROLES");
    if (role === "ROLE_ADMIN") {
      return instance.get(`/rest/employeeTrackingForm/allWithStatusNotDone/${page}/${pageSize}`);
    } else {
      const loggedUserId = localStorage.getItem("loggedUserId");
      return instance.get(
        `/rest/employeeTrackingForm/getAllForUser/${loggedUserId}/${page}/${pageSize}`, employeeTrackingFilter);
    }
  },

  getTasksFilterable:(page, pageSize, employeeTrackingFilter)=>{
    return instance.post(`/rest/employeeTrackingForm/allWithStatusNotDone/${page}/${pageSize}`, employeeTrackingFilter,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
    });
},

getFinishedTasksFilterable:(page, pageSize, employeeTrackingFilter)=>{
  return instance.post(`/rest/employeeTrackingForm/allWithStatusDone/${page}/${pageSize}`, employeeTrackingFilter,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json' 
    },
  });
}
};
export default DashboardService;
