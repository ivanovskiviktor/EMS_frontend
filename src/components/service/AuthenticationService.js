import axios from 'axios';
import instanceA from '../instance/instance.js';


const instance = axios.create({
    baseURL: process.env.REACT_APP_HOST_ENV,
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
getUserDetails: () => {
    return instanceA.get('/rest/user/getUserDetails', null, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
}
export default AuthenticationService;
