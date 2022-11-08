import axios from 'axios';
import instance from '../instance/instance';


const OrganizationalDepartmentService ={
    
    getWorkingItemsPageable:(page,pageSize)=>{
        return instance.get(`/rest/workingItem/get/${page}/${pageSize}`)
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
    }


}
export default OrganizationalDepartmentService;
