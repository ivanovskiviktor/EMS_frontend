import axios from "axios";
import instance from "../instance/instance";

const instanceUnauthorized = axios.create({
    baseURL: process.env.REACT_APP_HOST_ENV,
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
    }
    } 

    export default UserService;
  
