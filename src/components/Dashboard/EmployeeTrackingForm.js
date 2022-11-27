        import React, { Component, Fragment} from "react";
        import Container from "react-bootstrap/Container";
        import TextField from '@mui/material/TextField';
        import TextareaAutosize from '@mui/material/TextareaAutosize';
        import Form from "react-bootstrap/Form";
        import Select from "react-select";
        import OrganizationalDepartmentService from "../service/OrganizationalDepartmentService";
        import StatusService from "../service/StatusService";
        import dateFormat from "dateformat";
        import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
        import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
        import { DatePicker } from '@mui/x-date-pickers/DatePicker';
        import "./custom.css";
        import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
        import { faCancel, faSave } from "@fortawesome/free-solid-svg-icons";
        import EmployeeTrackingFormService from "../service/EmployeeTrackingFormService";
        import { sleep } from "../shared/functions/Sleep";
        import {Alert} from "@material-ui/lab";
        import Swal from "sweetalert2";
        import Checkbox from '@mui/material/Checkbox';
        import FormControlLabel from '@mui/material/FormControlLabel';
        import CustomizedHook from "../shared/components/CustomizedHook/CustomizedHook";

        export default class EmployeeTrackingForm extends Component{

            constructor(props) {
                super(props);   
                this.state = {
                    departments: [],
                    items: [],
                    statuses: [],
                    employeeTrackingFormHelper: {
                        taskStartDate: this.getTodaysDate(),
                        taskEndDate: null,
                        description: "",
                        value: 1,
                        workingItemId: null,
                        employeeTrackingFormStatusId: null,
                        organizationalDepartmentId: null,
                        title: null,
                        userIds: []
                    },
                    checked: false,
                    alert: {'hidden': true, 'message': null, 'type': 'success'}
                };
                this.handleChange = this.handleChange.bind(this);
                this.handleChangeSelect = this.handleChangeSelect.bind(this);
            }

            handleChange = (e) => {
                this.setState({
                    employeeTrackingFormHelper: {
                    ...this.state.employeeTrackingFormHelper,
                    [e.target.name]: e.target.value,
                },
                });  
            }

            handleChangeSelect = (e) => {
                this.setState({
                    employeeTrackingFormHelper: {
                    ...this.state.employeeTrackingFormHelper,
                    [e.name]: e.value || null,
                },
                });

                if (e.name === "organizationalDepartmentId") {
                    this.getWorkingTasksForOrgDepartment(e.value);
                }
            }

            handleChangeDate = (newValue) => {
                this.setState({
                    employeeTrackingFormHelper: {
                        ...this.state.employeeTrackingFormHelper,
                        taskStartDate: newValue.$d
                    }
                })
            };

            handleChangeEndDate = (newValue) => {
                this.setState({
                    employeeTrackingFormHelper: {
                        ...this.state.employeeTrackingFormHelper,
                        taskEndDate: newValue.$d
                    }
                })
            };

            handleSubmit = async (event) => {
            let uIds = [];
            if (this.state.checked) {
            uIds = this.state.employeeTrackingFormHelper.userIds;
            } else 
                {
                const loggedUser = localStorage.getItem("loggedUserId");
                uIds = [Number.parseInt(loggedUser)];
                }
                event.preventDefault();
                const startDate = this.state.employeeTrackingFormHelper.taskStartDate;
                const desc = this.state.employeeTrackingFormHelper.description;
                const val = this.state.employeeTrackingFormHelper.value;
                const endDate = this.state.employeeTrackingFormHelper.taskEndDate;
                const title = this.state.employeeTrackingFormHelper.title;
                var taskId = null;
                if(this.state.employeeTrackingFormHelper.workingItemId !== null){
                    taskId = this.state.employeeTrackingFormHelper.workingItemId;
                } else {
                    taskId = this.state.items[0].id;
                }
                var departmentId = null;
                if(this.state.employeeTrackingFormHelper.organizationalDepartmentId !== null){
                    departmentId = this.state.employeeTrackingFormHelper.organizationalDepartmentId;
                } else {
                    departmentId = this.state.departments[0].id;
                }
                var statusId = null;
                if (this.state.employeeTrackingFormHelper.employeeTrackingFormStatusId !== null) {
                     statusId = this.state.employeeTrackingFormHelper.employeeTrackingFormStatusId;
                } else {
                    statusId = this.state.statuses[0].id;
                }   

                await this.setState({
                     employeeTrackingFormHelper: {
                    ...this.state.employeeTrackingFormHelper,
                    workingItemId: taskId,
                    organizationalDepartmentId: departmentId,
                    employeeTrackingFormStatusId: statusId,
                    taskStartDate: startDate,
                    taskEndDate: endDate,
                    description: desc,
                    title: title,
                    value: val,
                    userIds: uIds
            }
        });
            if (title === null || uIds === [] || val === null || taskId === null || departmentId === null ||
                statusId === null || desc === "") {
            this.setState({
                alert: {'hidden': false, 'message': "Пополнете ги сите полиња соодветно!", 'type': 'error'}
            });
            await sleep(3000);
            this.setState({
                alert: {'hidden': true, 'message': null, 'type': 'error'}
            });
          }
          else {
            EmployeeTrackingFormService.createEmployeeTrackingForm(this.state.employeeTrackingFormHelper)
              .then((res) => {
                this.setState({
                  data: res.data,
                  alert: {'hidden': false, 'message': "Успешно креирана форма за одбраната работна задача!", 'type': 'success'}
                });
                sleep(2000);
                this.setState({
                    alert: {'hidden': true, 'message': null, 'type': 'success'}
                });
                if (this.props.onCreate) {
                    this.props.onCreate();
                  }
    
                  if (this.props.onAddTask) {
                    this.props.onAddTask();
                  }
                  Swal.fire({
                    icon: "success",
                    title: "Успешно!",
                    text: "Успешно креирана форма за одбраната работна задача!",
                  });
              })
              .catch((error) => {
                if (error.message === "Request failed with status code 500") {
                  this.setState({
                    alert: {'hidden': false, 'message': "Неуспешен внес, или ваков запис веќе постои во системот или не се' соодветно пополнети предвидените полиња!", 'type': 'error'}
                  });
                  sleep(3000);
                  this.setState({
                    alert: {'hidden': false, 'message': null, 'type': 'error'}
                  });
                }
                Swal.fire({
                  icon: "error",
                  title: "Грешка!",
                  text: "Неуспешно креирање на форма за одбраната работна задача!",
                });
              });
              this.setState({
              employeeTrackingFormHelper : {
                ...this.state.employeeTrackingFormHelper,
                description: "",
                title: null,
                taskStartDate: this.getTodaysDate(),
                workingItemId: null,
                organizationalDepartmentId: null,
                employeeTrackingFormStatusId: null,
                userIds: []
              },
              checked: false
            })
          }
        }
            
            async componentDidMount() {
                let id = localStorage.getItem("loggedUserId");
                await this.getDepartments(id);
                await this.getWorkingTasksForOrgDepartment(this.state.departments[0].id);
                await this.getStatusesNotPageable();
            }  

            async getDepartments(id) {
                await OrganizationalDepartmentService.getDepartmentsForUser(id)
                .then((response) => response.data)
                .then((data) => {
                    this.setState({
                        departments: data
                    });
                });
            }

            async getWorkingTasksForOrgDepartment(id) {
                await OrganizationalDepartmentService.getWorkingTasksForOrgDepartment(id)
                .then((response) => response.data)
                .then((data) => {
                    this.setState({
                        items: data
                    });
                });
            }

            async getStatusesNotPageable() {
            await StatusService.getStatusesNotPageable()
                .then((response) => response.data)
                .then((data) => {
                    this.setState({
                    statuses: data
                    });
                });
            }

            getTodaysDate(){
                var date = new Date();
                date.setMinutes(0);
                date.setHours(0);
                date.setSeconds(0);
                date.setMilliseconds(0);

                return date.toISOString();
            } 

            handleUsersChange = (users) => {
                if (this.state.checked) {
                  this.setState({
                    employeeTrackingFormHelper: {
                      ...this.state.employeeTrackingFormHelper,
                      userIds: users,
                    },
                  });
                } else {
                  var loggedUser = localStorage.getItem("loggedUserId");
                  this.setState({
                    employeeTrackingFormHelper: {
                      ...this.state.employeeTrackingFormHelper,
                      userIds: loggedUser,
                    },
                  });
                }
              };
            
            

            render() {
                let checked = this.state.checked;
                let role = localStorage.getItem("ROLES");   
                if(role === "ROLE_EMPLOYEE"){ 
                return (
                    this.props.showForm && (
                    <Fragment>
                        <Container>
                            <Form style={{marginTop: "4rem"}}>
                            <div className="row">
                                <div className="col-1"></div>
                                <div className="col-10">
                                    <label for="departments" style={{ fontSize: "20px", textAlign: "left", marginRight: "57.5rem"}}>Oдберете оддел:</label>
                                    <Select placeholder={this.state.departments[0]?.name} className="form-control" id="departments" onChange={this.handleChangeSelect}
                                    options={this.state.departments.map((department) => (
                                        { value: department.id, label: department.name, name: "organizationalDepartmentId" }
                                    ))}
                                    styles={{
                                        control: (provided) => ({
                                        ...provided,
                                        boxShadow: "none",
                                        border: "none"
                                        })
                                    }}>
                                    </Select>
                                </div>
                                <div className="col-1"></div>
                            </div><br/>
                            <div className="row">
                                <div className="col-1"></div>
                                <div className="col-10">
                                    <label for="items" style={{ fontSize: "20px", textAlign: "left", marginRight: "52rem"}}>Oдберете работна задача:</label>
                                    <Select placeholder={this.state.items[0]?.name} className="form-control" id="items" onChange={this.handleChangeSelect}
                                    options={this.state.items.map((item) => (
                                        { value: item.id, label: item.name, name: "workingItemId" }
                                    ))}
                                    styles={{
                                        control: (provided) => ({
                                        ...provided,
                                        boxShadow: "none",
                                        border: "none"
                                        })
                                    }}>
                                    </Select>
                                </div>
                                <div className="col-1"></div>
                            </div><br/>
                            <div className="row">
                                <div className="col-1"></div>
                                <div className="col-4">
                                <label for="items" style={{ fontSize: "20px", textAlign: "left", marginRight: "10.5rem"}}>Внесете име на активност:</label>
                                <input type="text" id="outlined-required" value={this.state.employeeTrackingFormHelper.title} 
                                name="title" className="form-control" onChange={this.handleChange} required/>
                                </div>
                                <div className="col-6">
                                <label for="description" style={{ fontSize: "20px", textAlign: "left", marginRight: "31.85rem"}}>Внесете опис:</label>
                                <TextareaAutosize
                                minRows={1.35}
                                maxRows={4}
                                name="description"
                                aria-label="description"
                                onChange={this.handleChange}
                                style={{width: "-webkit-fill-available", boxShadow: "none", border: "1px solid #ced4da", borderRadius: "0.375rem", backgroundClip:"padding-box"}}
                                required/>
                                </div>
                                <div className="col-1"></div>
                            </div><br/>
                            <div className="row">
                                <div className="col-1"></div>
                                <div className="col-4">
                                <label for="items" style={{ fontSize: "20px", textAlign: "left", marginRight: "11.5rem"}}>Oдберете статус и датум:</label>
                                    <Select placeholder={this.state.statuses[0]?.label} className="form-control" id="items" onChange={this.handleChangeSelect}
                                    options={this.state.statuses.map((status) => (
                                        { value: status.id, label: status.label, name: "employeeTrackingFormStatusId" }
                                    ))}
                                    styles={{
                                        control: (provided) => ({
                                        ...provided,
                                        boxShadow: "none",
                                        border: "none"
                                        })
                                    }}>
                                    </Select>
                                </div>
                                <div className="col-3" style={{marginTop:'1.7rem'}}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                id="taskStartDate"
                                name="taskStartDate"
                                label="Почетен датум"
                                value={dateFormat(this.state.employeeTrackingFormHelper.taskStartDate, "mm/dd/yyyy")}
                                onChange={this.handleChangeDate}
                                renderInput={(params) => <TextField {...params} fullWidth/>}/>
                                </LocalizationProvider>     
                                </div>
                                <div className="col-3" style={{marginTop:'1.7rem'}}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                disabled={true}
                                id="taskEndDate"
                                name="taskEndDate"
                                label="Краен датум"
                                value={null}
                                onChange={this.handleChangeEndDate}
                                renderInput={(params) => <TextField {...params} fullWidth/>}/>
                                </LocalizationProvider>    
                                </div>
                                <div className="col-1"></div>
                            </div>
                            <div className="row">
                            <div>
                            <br/><br/>
                            <button type="submit" class="btn btn-danger" onClick={() => { this.props.onCancel();}}
                            style={{marginLeft:'42rem'}}><FontAwesomeIcon icon={faCancel}/>
                             <span className="btn-wrapper--label">Поништи</span></button>
                             </div>
                             <div>
                            <button type="submit" class="btn btn-success" style={{marginLeft:'60rem', marginTop: '-4.1rem'}} onClick={this.handleSubmit}>
                                <FontAwesomeIcon icon={faSave}/><span className="btn-wrapper--label">Креирај</span> </button>
                             </div>
                            </div>
                            </Form>
                            <div style={{marginLeft: "23.75rem"}}>
                            <Alert className="m-3" variant="filled" style={{width: "fit-content"}} 
                                severity={this.state.alert.type} hidden={this.state.alert.hidden}>{this.state.alert.message}
                                </Alert>
                                </div>  
                        </Container>
                    </Fragment>
                    )
                );
                } else if (role === "ROLE_HEAD_OF_DEPARTMENT") {
                    return(    
                    this.props.showForm && (
                    <Fragment>
                        <Container>
                            <Form style={{marginTop: "4rem"}}>
                            <div className="row">
                                <div className="col-1"></div>
                                <div className="col-10">
                                    <label for="departments" style={{ fontSize: "20px", textAlign: "left", marginRight: "57.5rem"}}>Oдберете оддел:</label>
                                    <Select placeholder={this.state.departments[0]?.name} className="form-control" id="departments" onChange={this.handleChangeSelect}
                                    options={this.state.departments.map((department) => (
                                        { value: department.id, label: department.name, name: "organizationalDepartmentId" }
                                    ))}
                                    styles={{
                                        control: (provided) => ({
                                        ...provided,
                                        boxShadow: "none",
                                        border: "none"
                                        })
                                    }}>
                                    </Select>
                                </div>
                                <div className="col-1"></div>
                            </div><br/>
                            <div className="row">
                                <div className="col-1"></div>
                                <div className="col-10">
                                    <label for="items" style={{ fontSize: "20px", textAlign: "left", marginRight: "52rem"}}>Oдберете работна задача:</label>
                                    <Select placeholder={this.state.items[0]?.name} className="form-control" id="items" onChange={this.handleChangeSelect}
                                    options={this.state.items.map((item) => (
                                        { value: item.id, label: item.name, name: "workingItemId" }
                                    ))}
                                    styles={{
                                        control: (provided) => ({
                                        ...provided,
                                        boxShadow: "none",
                                        border: "none"
                                        })
                                    }}>
                                    </Select>
                                </div>
                                <div className="col-1"></div>
                            </div><br/>
                            <div className="row">
                                <div className="col-1"></div>
                                <div className="col-4">
                                <label for="items" style={{ fontSize: "20px", textAlign: "left", marginRight: "10.5rem"}}>Внесете име на активност:</label>
                                <input type="text" id="outlined-required" value={this.state.employeeTrackingFormHelper.title} 
                                name="title" className="form-control" onChange={this.handleChange} required/>
                                </div>
                                <div className="col-6">
                                <label for="description" style={{ fontSize: "20px", textAlign: "left", marginRight: "31.85rem"}}>Внесете опис:</label>
                                <TextareaAutosize
                                minRows={1.35}
                                maxRows={4}
                                name="description"
                                aria-label="description"
                                onChange={this.handleChange}
                                style={{width: "-webkit-fill-available", boxShadow: "none", border: "1px solid #ced4da", borderRadius: "0.375rem", backgroundClip:"padding-box"}}
                                required/>
                                </div>
                                <div className="col-1"></div>
                            </div><br/>
                            <div className="row">
                                <div className="col-1"></div>
                                <div className="col-4">
                                <label for="items" style={{ fontSize: "20px", textAlign: "left", marginRight: "11.5rem"}}>Oдберете статус и датум:</label>
                                    <Select placeholder={this.state.statuses[0]?.label} className="form-control" id="items" onChange={this.handleChangeSelect}
                                    options={this.state.statuses.map((status) => (
                                        { value: status.id, label: status.label, name: "employeeTrackingFormStatusId" }
                                    ))}
                                    styles={{
                                        control: (provided) => ({
                                        ...provided,
                                        boxShadow: "none",
                                        border: "none"
                                        })
                                    }}>
                                    </Select>
                                </div>
                                <div className="col-3" style={{marginTop:'1.7rem'}}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                id="taskStartDate"
                                name="taskStartDate"
                                label="Почетен датум"
                                value={dateFormat(this.state.employeeTrackingFormHelper.taskStartDate, "mm/dd/yyyy")}
                                onChange={this.handleChangeDate}
                                renderInput={(params) => <TextField {...params} fullWidth/>}/>
                                </LocalizationProvider>     
                                </div>
                                <div className="col-3" style={{marginTop:'1.7rem'}}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                disabled={true}
                                id="taskEndDate"
                                name="taskEndDate"
                                label="Краен датум"
                                value={null}
                                onChange={this.handleChangeEndDate}
                                renderInput={(params) => <TextField {...params} fullWidth/>}/>
                                </LocalizationProvider>    
                                </div>
                                <div className="col-1"></div>
                            </div><br/>
                            <div className="row">
                            <FormControlLabel 
                            control={
                            <Checkbox checked={this.state.checked} name="checked" id="selectCheckbox"
                            onClick={() => this.setState({ checked: !this.state.checked })}/>
                            }
                            style={{marginLeft:"6.2rem"}}
                            label="Дали сакате да ја доделите оваа задача на друг/и вработен/и?"/>
                            {checked && (
                                <div className="row">
                                <div className="col-1"></div>
                                <div className="col-10">
                                <CustomizedHook handleUsersChange={this.handleUsersChange}></CustomizedHook>
                                </div>
                                <div className="col-1"></div>
                                </div>
                            )}
                            </div><br/>
                            <div className="row">
                            <div>
                            <br/><br/>
                            <button type="submit" class="btn btn-danger" style={{marginLeft:'42rem'}} onClick={() => { this.props.onCancel();}}>
                            <FontAwesomeIcon icon={faCancel}/><span className="btn-wrapper--label">Поништи</span></button>
                             </div>
                             <div>
                            <button type="submit" class="btn btn-success" style={{marginLeft:'60rem', marginTop: '-4.1rem'}} onClick={this.handleSubmit}>
                                <FontAwesomeIcon icon={faSave}/><span className="btn-wrapper--label">Креирај</span> </button>
                             </div>
                            </div>
                            </Form>
                            <div style={{marginLeft: "23.75rem"}}>
                            <Alert className="m-3" variant="filled" style={{width: "fit-content"}} 
                                severity={this.state.alert.type} hidden={this.state.alert.hidden}>{this.state.alert.message}
                                </Alert>
                                </div>
                        </Container>
                    </Fragment>));
                } else {
                    return null;
                }
            }
        }