import axios from 'axios';
import instance from '../instance/instance';


const OrganizationalDepartmentService ={

    getDepartmentsPageable:(page,pageSize)=>{
        const role = localStorage.getItem("ROLES");
         if (role === "ROLE_ADMIN") {
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
    },

    getOrgDepartmentsNotPageable: () => {
        const id = localStorage.getItem("loggedUserId");
        return instance.get(`/rest/orgdepartment/allForUser/${id}`);
      },

      getWorkingTasksForOrgDepartment: (id) => {
        return instance.get(`/rest/workingItem/allByOrganizationalDepartment/${id}`);
      },
      
      setHeadUsers: (headUser) => {
        return instance.post(`/rest/orgdepartment/setHeadUsers`, headUser);
      },

    getDepartmentsNotPageable: () => {
        return instance.get('/rest/orgdepartment/getAll');
    },

    getDepartmentsForUser: (id) => {
        return instance.get(`/rest/orgdepartment/getForUser/${id}`);
    },

    addOrganizationalDepartmentToUser:(organizationalDepartmentIdHelper) => {
    
        return instance.post('/rest/orgdepartment/addOrganizationalUnit', organizationalDepartmentIdHelper, {
          headers: {
              'Content-Type': 'application/json',
          }
      })

    },

    deleteOrganizationalDepartmentFromUser:(organizationalDepartmentIdHelper) => {
        return instance.post('/rest/orgdepartment/deleteOrgDepartment', organizationalDepartmentIdHelper, {
        headers:{
          'Content-Type': 'application/json',
        }
      })
      }    
}
export default OrganizationalDepartmentService;
