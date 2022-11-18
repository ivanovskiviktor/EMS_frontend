import React, { Component, Fragment } from "react";
import OrganizationalDepartmentService from "../service/OrganizationalDepartmentService";
import UserService from "../service/UserService";
import WorkingTaskService from "../service/WorkingTaskService";
import NavBar from "../shared/components/NavBar/NavBar";
import Spinner from "../shared/components/Spinner/Spinner";
import Swal from "sweetalert2";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPersonCircleCheck, faSave, faTasks} from "@fortawesome/free-solid-svg-icons";
import OrganizationalDepartmentAddHead from "./OrganizationalDepartmentAddHead";

export default class OrganizationalDepartmentModify extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          organizationalDepartmentWorkingItemHelper: {
            organizationalDepartmentId: null,
            workingItemIds: []
          },        
          spinner: true,
          departments: [],
          tasks: [],
          filteredTasks: [],
          items: [],
          openOrgTasks: true,
          openHeadUsers: false,
          selectedDepartment: null,
          isSelected: false
        };
        this.handleOpenOrgTasks = this.handleOpenOrgTasks.bind(this);
        this.handleOpenHeadUsers = this.handleOpenHeadUsers.bind(this);
      }

      async componentDidMount() {
        await this.getOrgDepartments();
        await this.getTasks();
        await this.handleTabsChange(this.state.departments[0].id);
        this.setState({
            spinner: false
        });
      }
    
    
      async getOrgDepartments() {
        await OrganizationalDepartmentService.getOrgDepartmentsNotPageable()
          .then((response) => response.data)
          .then((data) => {
            this.setState({
                departments: data
            });
          });
      }

      async getTasks() {
        await WorkingTaskService.getWorkingTasksNotPageable()
          .then((response) => response.data)
          .then((data) => {
            this.setState({
              tasks: data,
              filteredTasks: data
            });
          });
      }

      handleChange = (e) => {
        let value = e.target[e.target.selectedIndex].value;
        value = parseInt(value);
        this.setState({
            organizationalDepartmentWorkingItemHelper: {
            [e.target.name]: value,
          },
        });
        if (e.target.name === "organizationalDepartmentId") {
          this.handleTabsChange(value);
        }
    
        let valueOne = e.target[e.target.selectedIndex].value;
        valueOne = parseInt(valueOne);
        this.setState({
          [e.target.name]: valueOne,
        });
        if (e.target.name === "organizationalDepartmentId") {
          this.handleTabsChange(valueOne);
        }
    
        let valueTwo = e.target[e.target.selectedIndex].value;
        valueTwo = parseInt(valueTwo);
        this.setState({
          [e.target.name]: valueTwo,
        });
        if (e.target.name === "organizationalDepartmentId") {
          this.handleTabsChange(valueTwo);
        }
      };

      handleOpenHeadUsers() {
        this.state.organizationalDepartmentId = " ";
        this.setState({
          openHeadUsers: true,
          openOrgTasks: false
        });
      }
    
      handleOpenOrgTasks() {
        this.state.organizationalDepartmentId = " ";
        this.setState({
          openOrgTasks: true,
          openHeadUsers: false
        });
      }

      handleChangeItems = (e) => {
        let arr = document.getElementsByClassName("check_box");
        let arr2 = [];
        Array.prototype.forEach.call(arr, function (el) {
          if (el.checked === true) {
            arr2.push(parseInt(el.id));
          }
        });
        this.setState({
            organizationalDepartmentWorkingItemHelper: {
            ...this.state.organizationalDepartmentWorkingItemHelper,
            workingItemIds: arr2
          },
        });
      };


      handleChangeTwo = (e) => {
        this.setState({
          [e.target.name]: e.target.value || null,
        });
      };
    
      filter = (e) => {
        let arr = [...this.state.organizationalDepartmentWorkingItemHelper.workingItemIds];
        for (var i = 0; i < this.state.organizationalDepartmentWorkingItemHelper.workingItemIds.length; i++) {
          if (this.state.organizationalDepartmentWorkingItemHelper.workingItemIds[i].checked === true) {
            arr.push(this.state.organizationalDepartmentWorkingItemHelper.workingItemIds[i].id);
          }
        }
        this.setState({
            organizationalDepartmentWorkingItemHelper: {
            ...this.state.organizationalDepartmentWorkingItemHelper,
            workingItemIds: arr,
          },
        });
    
        document.addEventListener("DOMContentLoaded", function () {
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] !== null) {
              document.getElementById(arr[i]).checked = "true";
            }
          }
        });
        const value = e.target.value;
        if (value === null || value === "") {
          this.setState({
            filteredTasks: this.state.items
          });
        } else {
          let list = [];
          this.state.items.map((item) => {
            if (item.name !== null) {
              if (
                item.name.toLocaleString().toLowerCase().includes(value.toLowerCase())
              ) {
                list.push(item);
              }
            }
          });
          if (list.length > 0) {
            this.setState({
                filteredTasks: list
            });
          } else {
            this.setState({
                filteredTasks: []
            });
          }
        }
        this.handleTabsChange(this.state.selectedDepartment);
      };
    
      async handleTabsChange(selectedOrgDepartmentId) {
        if (this.state.openOrgTasks === true) {
          await OrganizationalDepartmentService.getWorkingTasksForOrgDepartment(selectedOrgDepartmentId)
            .then((response) => response.data)
            .then((data) => {
              this.setState({
                items: data, 
                selectedDepartment: selectedOrgDepartmentId
              });
              let arr = document.getElementsByClassName("check_box");
              Array.prototype.forEach.call(arr, function (el) {
                el.checked = false;
                el.disabled = false;
              });
              data.forEach((elem) => {
                if (document.getElementById(elem.id) !== null) {
                  document.getElementById(elem.id).checked = "true";
                  if (elem.presentInEmployeeTrackingForm) {
                    document.getElementById(elem.id).disabled = "true";
                  }
                }
              });
            });
        } 
        else if (this.state.openHeadUsers === true) {
          await UserService.getAllHeadInOrganization(selectedOrgDepartmentId).then(
            (response) => {
              let arr = document.getElementsByClassName("check_boxheadusers");
              Array.prototype.forEach.call(arr, function (el) {
                el.checked = false;
                el.disabled = false;
              });
              response.data.forEach((elem) => {
                if (document.getElementById(elem.userId) !== null) {
                  document.getElementById(elem.userId).checked = "true";
                }
              });
            }
          );
        }
      }   
      
      handleSubmit = (e) => {
        e.preventDefault();
        WorkingTaskService.saveTasks(this.state.organizationalDepartmentWorkingItemHelper)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Успешно!",
              text: "Промените се успешно зачувани!",
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Грешка!",
              text: "Настаната е грешка. Обидете се повторно!",
            });
          });
      };
      
    
    render() {
        const {  spinner  } = this.state;
        return( 
            <Fragment>
            <NavBar/>
            <br/>
            {this.state.openOrgTasks && (
            <h2 style={{marginTop:"2rem"}}>Промена на работните задачи во рамки на организациски оддел</h2>)}
            {this.state.openHeadUsers && (
            <h2 style={{marginTop:"2rem"}}>Промена на раководителите во рамки на организациски оддел</h2>)}
            <br/><br/><br/>
            <div className="container">
              <div style={{ display: "flex", justifyContent: "center"}}>
            <button type="button" class="btn btn-warning" onClick={this.handleOpenOrgTasks}><FontAwesomeIcon icon={faTasks}/> 
            <span className="btn-wrapper--label">Промени работни задачи</span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button type="button" class="btn btn-warning ml-5" onClick={this.handleOpenHeadUsers}><FontAwesomeIcon icon={faPersonCircleCheck}/> 
            <span className="btn-wrapper--label">Промени раководител</span></button>
            </div>
            <br/><br/><br/>
          <select
            className="form-control ml-3"
            name="organizationalDepartmentId"
            value={this.state.organizationalDepartmentWorkingItemHelper.organizationalDepartmentId}
            id="sectors"
            placeholder="Одберете го одделот..."
            style={{ width: "50%", display: "block", margin: "0 auto", boxShadow: "revert" }}
            onChange={this.handleChange}>
            <option value=" ">-- Одберете оддел --</option>
            {this.state.departments.map((department) => (
              <option id="option" value={department.id}> {department.name} </option>
            ))}
          </select>
          <div className="row">
            <div className="col">
              {this.state.openOrgTasks === true && (
                <div style={{ marginTop: "1.875rem" }}>  
                  <br/><br/><br/>
                  <p style={{ fontFamily: "sans-serif", color: "#A9A9A9", fontSize: "1.5rem", fontWeight: "bold", 
                              display: "flex", marginLeft: "20.75rem"}}>
                    Работни задачи:{" "}</p>{" "}
                  <br/>
                  <ul style={{ listStyleType: "none", display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
                      justifyItems: "baseline", marginLeft: "18.75rem"}}>
                    {this.state.filteredTasks.length === "" && this.state.filteredTasks.length === 1 ? (<div />) : 
                    (this.state.filteredTasks.map((task) => (
                        <div style={{ textAlign: "left", marginRight: "1.25rem" }}>
                        <li>
                            <label>
                                <input type="checkbox" name={task.name} id={task.id} className="check_box" 
                                onChange={(e) => this.handleChangeItems(e)}/>&nbsp;{task.name}
                            </label>
                        </li>
                        </div>
                        )))}
                  </ul> <br/><br/>
                  <button type="button" class="btn btn-success" onClick={(e) => this.handleSubmit(e)} style={{marginLeft: "30.1rem"}}><FontAwesomeIcon icon={faSave}/>
                  <span className="btn-wrapper--label">Зачувај промени</span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
              )}
            </div>
          </div>
          <div>
            {this.state.openHeadUsers === true && (
              <OrganizationalDepartmentAddHead organizationalDepartmentId={this.state.organizationalDepartmentWorkingItemHelper.organizationalDepartmentId}/>)}
          </div>
            </div>
           </Fragment>  
        )
    }


}