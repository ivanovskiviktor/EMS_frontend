import axios from 'axios';
import instanceA from '../instance/instance.js';


const instance = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
});

const AuthenticationService ={
loginUser: (request) => {
    return instance.post('/rest/login', request, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + request
        }
    })
},
userRole: () => {
    return instanceA.get('/rest/user/getUserDetails', null, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
},

loginUserNew: () => {
    return instance.get('/externalLogin', {
        headers: {
            'Content-Type': 'application/json',
        }
    })
}
}
export default AuthenticationService;
