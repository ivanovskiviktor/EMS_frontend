import axios from 'axios';
import instance from '../instance/instance';

const StatusService ={
    getStatusesPageable:(page,pageSize)=>{
        return instance.get(`/rest/status/all/${page}/${pageSize}`)
    },
    getStatusById:(id)=>{
        return instance.get(`rest/status/get/${id}`)
    },
    addStatus: (status) => {
   
        return instance.post("/rest/status/create", status, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    },
    updateStatus:(status,id)=>{
        return instance.put("/rest/status/update", status, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

    },
    deleteStatus:(id)=>{
        return instance.delete(`/rest/status/delete/${id}`);
    }

}
export default StatusService;
