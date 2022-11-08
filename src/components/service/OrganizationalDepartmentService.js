import axios from 'axios';
import instance from '../instance/instance';


const OrganizationalDepartmentService ={
    getDepartmentsPageable:(page,pageSize)=>{
        const role = localStorage.getItem("ROLES");
         if (role === "ROLE_ADMIN" || role === "ROLE_SUPERVISOR") {
        return instance.get(`/rest/orgdepartment/get/${page}/${pageSize}`)
         } else {
             const loggedUser = localStorage.getItem("loggedUserId");
             return instance.get(`/rest/orgdepartment/all/${loggedUser}`);
         }
    },

    getDepartmentById:(id)=>{
        return instance.get(`rest/orgdepartment/get/${id}`)
    },


    addOrganizationalDepartment: (organizationalDepartment) => {
   
        return instance.post("/rest/orgdepartment/create", organizationalDepartment,
        { 
             headers: {
                'Content-Type' : 'application/json' ,
                
             }
        });
    },

    updateOrganizationalDepartment: (organizationalDepartment)=>{
        return instance.put("/rest/orgdepartment/update", organizationalDepartment,
        {
            headers: {
                'Content-Type': 'application/json',
            }
        })
    },


    deleteOrganizationalDepartment:(id)=>{
        return instance.delete(`/rest/orgdepartment/delete/${id}`);
    }


}
export default OrganizationalDepartmentService;
