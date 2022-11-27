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

    getTaskById:(id)=>{
      return instance.get(`rest/employeeTrackingForm/get/${id}`)
    },

    updateTask: (task) => {
      return instance.put("/rest/employeeTrackingForm/update", task, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
      });
    },

    updateClosedTask: (id)=>{
      return instance.post(`/rest/employeeTrackingForm/updateClosedTask/${id}`)
    }
}
export default EmployeeTrackingFormService;