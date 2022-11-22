import React, { useEffect } from 'react';
import Select from 'react-select';
import UserService from '../../../service/UserService';
import "./customized-hook.css";

const CustomizedHook = (props) => {

    const [users, setUsers] = React.useState([]);

    const [chosenUsers, setChosenUsers] = React.useState([]); 

    const [loggedUser, setLoggedUser] = React.useState([]);

    useEffect(() => {
        async function getUsers() {
            await UserService.getAllApprovedUsersByLoggedHeadUser()
            .then((response) =>{
                setUsers(response.data)
            });     
    }
         function getUserId() {
            UserService.getUserDetails()
            .then((response) => {
               setLoggedUser(response.data)
            });
        }
   

        getUsers();
        getUserId();

}, []);

        const userChange = (chosenUsers) => {
            setChosenUsers(Array.isArray(chosenUsers) ? chosenUsers.map(x => x.id) : []);
            props.handleUsersChange(Array.isArray(chosenUsers) ? chosenUsers.map(x => x.id) : []);
} 

    return(    
        <div>
            <Select
                placeholder="Одберете вработен/и"
                className="basic-single"
                classNamePrefix="select"
                isDisabled={false}
                isLoading={false}
                isClearable={true}
                isRtl={false}
                isMulti={true}
                isSearchable={true}
                options={users}
                defaultInputValue={loggedUser.email}
                getOptionLabel ={(option)=>option.person.firstName + " " + option.person.lastName}
                getOptionValue ={(option)=>option.id}
                onChange={userChange}
                noOptionsMessage={() => 'Нема вработени со вакво име или презиме!'}
                name="name"
                id="mySelector"/>
        </div>
    )
}
export default CustomizedHook;