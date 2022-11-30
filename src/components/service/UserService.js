import axios from "axios";
import instance from "../instance/instance";

const instanceUnauthorized = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
});

const UserService = {
    registerUser: (userHelper, email, password,) => {
        return instanceUnauthorized.post("/rest/user/signup", userHelper,{
            headers: {
                'Content-Type': 'application/json',
                'email': email,
                'password': password,
            }
        });
    },

    getUserDetails: () => {
      return instance.get("/rest/user/getUserDetails");
    },

    getAllHeadInOrganization:(id)=>{
        return instance.get(`/rest/user/getAllHeadInOrganization/${id}`)
      },

    getHeadUsers: ()=>{
        return instance.get(`/rest/user/getHeadUsers`);
      },

      getAllUsers: () => {
        return instance.get("rest/user/getAllUsers");
      },

    getAllUsersPageable: (page, pageSize, userFilter) => {
        return instance.post(`/rest/user/get/${page}/${pageSize}`, userFilter, {
            headers: {
              "Content-Type": "application/json",
            },
          });
      },

    enableUser: (id) => {
        return instance.post(`rest/user/enableUser/${id}`);
      },

    disableUser: (id) => {
        return instance.post(`rest/user/disableUser/${id}`);
      },

    setLoggedUserAsHead: (id) => {
        return instance.get(`rest/user/setLoggedUserAsHead/${id}`);
      },

    setLoggedUserAsEmployee: (id) => {
        return instance.get(`rest/user/setLoggedUserAsEmployee/${id}`);
      },
     
    getUsersDepartments:(id) => {
        return instance.get(`/rest/orgdepartment/getForUser/${id}`);
      },

      getUserById:(id) => {
        return instance.get(`/rest/user/get/${id}`);
      },

      setHeadUserForUser:(headUserHelper) => {
        return instance.post(`/rest/user/setHeadUserForUser`, headUserHelper);
      },
      
      removeHeadUserForUser:(headUserHelper) => {
        return instance.post(`/rest/user/removeHeadUserFromUser`, headUserHelper); 
      },

      getAllApprovedUsersByLoggedHeadUser:() => {
        return instance.get(`rest/user/getAllApprovedUsersByLoggedHeadUser`);
      },

      findAllUsersWithSameOrganizationalUnitAndNotApprovedByHead:() => {
        return instance.get(`rest/user/findAllUsersWithSameOrganizationalUnitAndNotApprovedByHead`);
      }
  
    } 
    export default UserService;
  