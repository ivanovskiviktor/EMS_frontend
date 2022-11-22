import React, { useState, useEffect, useRef } from "react";
import OrganizationalDepartmentService from "../service/OrganizationalDepartmentService";
import WorkingTaskService from "../service/WorkingTaskService";
import EmployeeTrackingForm from "./EmployeeTrackingForm";
import EmployeeTrackingFormTable from "./EmployeeTrackingFormTable";

export const EmployeeTrackingFormAndTable = (props) => {

    const [orgDepartments, setOrgDepartments] = useState(null);

    const [workingTasks, setWorkingTasks] = useState(null);

    const [departmentName, setDepartmentName] = useState(null);

    const [taskName, setTaskName] = useState(null);

    const [tasks, setAllTasks] = useState(null);

    const [taskTitle, setTaskTitle] = useState(null);

    const [selectedOrganizationalDepartmentId, setSelectedOrganizationalDepartmentId] = useState(null);

    const [selectedWorkingItemId, setSelectedWorkingItemId] = useState(null);

    const myRef = useRef(null);


    useEffect(() => {
        var id = localStorage.getItem("loggedUserId");
        async function getDepartments(id) {
          await OrganizationalDepartmentService.getDepartmentsForUser(id)
            .then((response) => response.data)
            .then((departments) => {
                setOrgDepartments(departments);
            });
        }
        async function getTasks() {
          await WorkingTaskService.getWorkingTasksNotPageable()
            .then((response) => response.data)
            .then((tasks) => {
                setWorkingTasks(tasks);
            });
        }
    
        getDepartments(id);
        getTasks();
      }, []);

      function pull_data(data, data2) {
        myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        var temp = null;
        if (data !== null && data2 !== undefined && data2 !== null) {
          setAllTasks(data2);
          for (var i = 0; i < data2.length; i++) {
            if (data === data2[i].id) {
              temp = data2[i];
            }
          }
          for (var j = 0; j < orgDepartments.length; j++) {
            if (orgDepartments[j].code === temp.organizationalDepartmentCode) {
                setDepartmentName(orgDepartments[j]);
              setSelectedOrganizationalDepartmentId(orgDepartments[j].id);
            }
          }
    
          for (var k = 0; k < workingTasks.length; k++) {
            if (workingTasks[k].id === temp.workingItemId) {
              setTaskName(workingTasks[k]);
              setSelectedWorkingItemId(workingTasks[k].id)
            }
          }
          for (var x = 0; x < data2.length; x++) {
            if (data2[x].id === data) {
              setTaskTitle(data2[x].title);
            }
          }
        }
    
        return departmentName, taskName;
      }

      let child;
      const [showForm, setShowForm] = useState(false);

  function itemCreated() {
    child.getTasksFilterable(0,5);
  }

  function formToggle() {
    setShowForm(!showForm);
  }

  return (
    <div>
      <span ref={myRef}></span>
      <EmployeeTrackingForm
        taskTitle={taskTitle}
        departmentName={departmentName}
        taskName={taskName}
        tasks={tasks}
        selectedOrganizationalDepartmentId={selectedOrganizationalDepartmentId}
        selectedWorkingItemId={selectedWorkingItemId}
        showForm={showForm}
        onCreate={() => {
          itemCreated();
        }}
        onAddTask={() => {
          formToggle();
        }}
        onCancel={() => {
          formToggle();
        }}
      />
      <br />
      <br />
      {showForm && (
      <hr style={{ marginLeft: "30px", marginRight: "30px" }} />)}
      <EmployeeTrackingFormTable
        taskTitle={taskTitle}
        departmentName={departmentName}
        taskName={taskName}
        tasks={tasks}
        selectedOrganizationalDepartmentId={selectedOrganizationalDepartmentId}
        selectedWorkingItemId={selectedWorkingItemId}
        ref={(instance) => {
          child = instance;
        }}
        onToggleForm={() => {
          formToggle();
        }}
        func={pull_data}
        pageForFinishedTasks={false}

      />

      {!showForm ? (
        <div
          style={{ position: "absolute", right: "0", left: "0", bottom: "0" }}
        >
        </div>
      ) : (
        <div
          style={{
            margin: "100px auto auto auto",
            position: "absolute",
            right: "0",
            left: "0",
          }}
        >
        </div>
      )}
    </div>
  );
}; 
export default EmployeeTrackingFormAndTable;