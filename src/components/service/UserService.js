import axios from "axios";
import instance from "../instance/instance";

const instanceUnauthorized = axios.create({
    baseURL: process.env.REACT_APP_HOST_ENV,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
});

const UserService = {
    activeUsers: () => {
        return instance.get(`/rest/user/getUserDetails`);
    },
    enableUser: (id) => {
        return instance.post(`/rest/user/enableUser/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    },
    adminRegisterUser:(userHelper)=>{
        return instance.post(`rest/user/registerUser`, userHelper,{
        headers:{
            'Content-Type': 'application/json',
        }
    });},
    registerUser: (userHelper, email, password,) => {
        return instanceUnauthorized.post("/rest/user/signup", userHelper,{
            headers: {
                'Content-Type': 'application/json',
                'email': email,
                'password': password,
            }
        });
    },
    forgotPassword: (email) => {
        return instanceUnauthorized.post("/rest/user/forgot_password", {
            headers: {
                'Content-Type': 'application/json',
                'email': email,
            }
        });
    }
    } 

    export default UserService;
  
