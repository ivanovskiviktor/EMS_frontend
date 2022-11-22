    import React from 'react';
    import NavBar from '../shared/components/NavBar/NavBar';
    import EmployeeTrackingFormAndTable from './EmployeeTrackingFormAndTable';

    export const Dashboard = (props) => {
        return (
            <div>
            <NavBar/>
            <h2 style={{marginTop:"2rem"}}>Контролна табла</h2>
            <EmployeeTrackingFormAndTable/>
            </div>
        )   
    }

    export default Dashboard