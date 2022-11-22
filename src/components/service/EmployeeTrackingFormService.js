import axios from 'axios';
import instance from '../instance/instance';

const EmployeeTrackingFormService ={

    createEmployeeTrackingForm:(trackingForm)=>{
        return instance.post("/rest/employeeTrackingForm/create", trackingForm, {
            headers: {
              "Content-Type": "application/json",
            },
          });
    },

    closeTask:(taskId)=>{
      return instance.get(`rest/employeeTrackingForm/closeTask/${taskId}`)
    },

    deleteTask: (taskId) => {
      return instance.delete(`/rest/employeeTrackingForm/delete/${taskId}`);
    },
}
export default EmployeeTrackingFormService;