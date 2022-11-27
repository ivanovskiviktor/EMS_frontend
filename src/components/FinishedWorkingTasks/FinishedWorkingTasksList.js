import EmployeeTrackingFormTable from '../Dashboard/EmployeeTrackingFormTable';
import React, { useState, Fragment } from 'react';
import NavBar from "../shared/components/NavBar/NavBar";

export const FinishedWorkingTasksList = (props) => {

    
    let child;
    const [showForm, setShowForm] = useState(false)

    function itemCreated() {
        child.getTasksFilterable(0,5);
    }

    function formToggle() {
        setShowForm(!showForm)
    }

    return (
        <Fragment>
            <NavBar/>
            <br/>
            <br/>
            <h2>Завршени задачи</h2>
            <EmployeeTrackingFormTable ref={instance => { child = instance; }} onToggleForm={()=> {formToggle()}} pageForFinishedItems={true}/>
            {!showForm?  <div style={{ position:"absolute", right:"0", left:"0", bottom:"0"}}>
                </div> :
                <div style={{margin:"100px auto auto auto", position:"absolute", right:"0", left:"0"}}>
                </div>
            }
        </Fragment>
    )
}
export default FinishedWorkingTasksList
