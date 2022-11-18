import axios from 'axios';
import instance from '../instance/instance';


const WorkingTaskService ={
    
    getWorkingItemsPageable:(page,pageSize)=>{
        return instance.get(`/rest/workingItem/get/${page}/${pageSize}`)
    },

    getWorkingTasksNotPageable:()=>{
        return instance.get(`/rest/workingItem/all`);
    },

    getWorkingItemById:(id)=>{
        return instance.get(`rest/workingItem/get/${id}`)
    },

    addWorkingItem: (workingItem) => {
   
        return instance.post("/rest/workingItem/create", workingItem, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    },

    updateWorkingItem:(workingItem)=>{
        return instance.put("/rest/workingItem/update", workingItem, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

    },

    deleteWorkingItem:(id)=>{
        return instance.delete(`/rest/workingItem/delete/${id}`);
    },

    saveTasks:(tasks) => {
        return instance.post("/rest/orgDepartmentWorkingItem/create", tasks)
      }
}
export default WorkingTaskService;
