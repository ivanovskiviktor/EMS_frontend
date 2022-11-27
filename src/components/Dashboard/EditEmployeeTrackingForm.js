    import React, { Component, Fragment } from "react";
    import UserService from "../service/UserService";
    import OrganizationalDepartmentService from "../service/OrganizationalDepartmentService";
    import StatusService from "../service/StatusService";
    import Form from "react-bootstrap/Form";
    import Dialog from '@mui/material/Dialog';
    import DialogActions from '@mui/material/DialogActions';
    import DialogContent from '@mui/material/DialogContent';
    import DialogTitle from '@mui/material/DialogTitle';
    import EmployeeTrackingFormService from "../service/EmployeeTrackingFormService";
    import TextField from '@mui/material/TextField';
    import TextareaAutosize from '@mui/material/TextareaAutosize';
    import dateFormat from "dateformat";
    import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
    import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
    import { DatePicker } from '@mui/x-date-pickers/DatePicker';
    import Button from '@mui/material/Button';
    import Checkbox from '@mui/material/Checkbox';
    import FormControlLabel from '@mui/material/FormControlLabel';
    import CustomizedHook from "../shared/components/CustomizedHook/CustomizedHook";

    export default class EditEmployeeTrackingForm extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
            data: {
                id: this.props.selectedTask.id,
                name: this.props.selectedTask.workingItemName,
                description: this.props.selectedTask.employeeTrackingFormDescription,
                taskStartDate: this.props.selectedTask.startDate,
                taskEndDate: this.props.selectedTask.endDate,
                value: this.props.selectedTask.value,
                status: this.props.selectedTask.statusName,
                title: this.props.selectedTask.title,
                selectedStatus: this.props.selectedTask.statusId,
                selectedDepartment: this.props.selectedTask.organizationalDepartmentId,
                selectedTask: this.props.selectedTask.workingItemId,
                userIds: [],
            },
            items: [],
            statuses: [],
            departments: [],
            users: [],
            open: true,
            checked: false
            };
        }

            async componentDidMount() {
                let id = localStorage.getItem("loggedUserId");
                await this.getDepartments(id);
                await this.getWorkingTasksForOrgDepartment(this.state.data.selectedDepartment);
                await this.getStatusesNotPageable();
                if(localStorage.getItem("ROLES") === "ROLE_HEAD_OF_DEPARTMENT"){
                await this.getUsers();
                }

                EmployeeTrackingFormService.getTaskById(this.state.data.id).then((res) => {
                    let task = res.data;
                    res.data.employeeTrackingFormStatusId = res.data.status.id;
                    res.data.workingItemId = res.data.organizationalDepartmentWorkingItem.workingItem.id;
                    res.data.organizationalDepartmentId = res.data.organizationalDepartmentWorkingItem.organizationalDepartment.id;
                    
                    this.setState({
                        data: task,
                    });
                    });
            }  

            async getUsers() {
                await UserService.getAllApprovedUsersByLoggedHeadUser()
                .then((response) => response.data)
                .then((data) => {
                    this.setState({
                        users: data
                    })
                });     
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
            
            handleChangeSelect = (e) => {
                this.setState({
                    data: {
                    ...this.state.data,
                    [e.target.name]: e.target.value
                },
                });

                if (e.target.name === "organizationalDepartmentId") {
                    this.getWorkingTasksForOrgDepartment(e.target.value);
                }
            }

            handleClose = () => {
                this.setState({
                    open: false
                })
            }

            handleChangeDate = (newValue) => {
                this.setState({
                    data: {
                        ...this.state.data,
                        taskEndDate: newValue.$d
                    }
                })
            };

            handleSubmit = () => {
                debugger;
                let uIds = [];
                if (this.state.checked) {
                  uIds = this.state.data.userIds;
                } else {
                  const loggedUser = localStorage.getItem("loggedUserId");
                  uIds = [Number.parseInt(loggedUser)];
                }
                this.setState({
                  data: {
                    ...this.state.data,
                    userIds: uIds,
                  },
                });
                EmployeeTrackingFormService.updateTask(this.state.data)
                  .then((res) => {
                    this.setState({ data: res.data });
                    if (this.props.onSave) {
                      this.props.onSave();
                    };
                  })
                  .catch((error) => {
                  });
              };

              handleUsersChange = (users) => {
                if (this.state.checked) {
                  this.setState({
                    data: {
                      ...this.state.data,
                      userIds: users,
                    },
                  });
                } else {
                  var loggedUser = localStorage.getItem("loggedUserId");
                  this.setState({
                    data: {
                      ...this.state.data,
                      userIds: loggedUser,
                    },
                  });
                }
              };

        render() {
            const role = localStorage.getItem("ROLES");
            if(role === "ROLE_EMPLOYEE") {
            return(
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle style={{fontSize: "20px"}}>Уредете ја селектираната форма</DialogTitle>
                        <DialogContent>
                        <Fragment>
                        <Form>
                        <div className="row">
                        <div className="col-12">
                        <label for="departments" style={{ color: '#4A4A4A', fontSize: '18px', textAlign: 'left', marginRight: '18rem' }}>Оддел:</label>
                        <select disabled name="organizationalDepartmentId" id="departments"
                        value={this.state.data.organizationalDepartmentId} style={{cursor:'not-allowed'}}
                        className="form-control" onChange={this.handleChangeSelect}>
                            {this.state.departments.map((item) => (
                            <option value={item.id}>{item.name}</option>
                            ))}
                            
                        </select>
                        </div>
                        </div><br/>
                        <div className="row">
                        <div className="col-12">
                        <label for="items" style={{ color: '#4A4A4A', fontSize: '18px', textAlign: 'left', marginRight: '18rem' }}>Работна задача:</label>
                        <select name="workingItemId" id="items"
                        value={this.state.data.workingItemId}
                        className="form-control" onChange={this.handleChangeSelect}>
                            {this.state.items.map((item) => (
                            <option value={item.id}>{item.name}</option>
                            ))}
                        </select>
                        </div>
                        </div><br/>
                        <div className="row">
                        <div className="col-12">
                        <label for="items" style={{ color: '#4A4A4A', fontSize: '18px', textAlign: 'left', marginRight: '18rem' }}>Име на активност:</label>
                        <input className="form-control" type="text" name="title"
                        value={this.state.data.title} onChange={this.handleChangeSelect}/>
                        </div>
                        </div><br/>
                        <div className="row">
                        <div className="col-12">
                        <label for="description" style={{ color: '#4A4A4A', fontSize: '18px', textAlign: 'left', marginRight: '18rem' }}>Опис:</label>
                        <TextareaAutosize
                                minRows={1.35}
                                maxRows={4}
                                id="description"
                                name="description"
                                aria-label="description"
                                onChange={this.handleChangeSelect}
                                style={{width: "-webkit-fill-available", boxShadow: "none", border: "1px solid #ced4da", borderRadius: "0.375rem", backgroundClip:"padding-box"}}
                                defaultValue={this.state.data.description}/>
                        </div>
                        </div><br/>
                        {/* <div className="row">
                        <div className="col-12">
                        <label for="statuses" style={{ color: '#4A4A4A', fontSize: '18px', textAlign: 'left', marginRight: '18rem' }}>Статус на активност:</label>
                        <select name="employeeTrackingFormStatusId" id="statuses"
                        value={this.state.data.employeeTrackingFormStatusId}
                        className="form-control" onChange={this.handleChangeSelect}>
                            {this.state.statuses.map((status) => (
                            <option value={status.id}>{status.label}</option>
                            ))}
                        </select>
                        </div>
                        </div><br/> */}<br/>
                        <div className="row">
                        <div className="col-6">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                disabled={true}
                                id="taskStartDate"
                                name="taskStartDate"
                                label="Почетен датум"
                                value={dateFormat(this.state.data.taskStartDate, "mm/dd/yyyy")}
                                renderInput={(params) => <TextField {...params} fullWidth sx={{'.MuiInputBase-input': {cursor:'not-allowed'},}} />}/>
                                </LocalizationProvider>  
                        </div>
                        <div className="col-6">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                id="taskEndDate"
                                name="taskEndDate"
                                label="Краен датум"
                                value={this.state.data.taskEndDate}
                                onChange={this.handleChangeDate}
                                renderInput={(params) => <TextField {...params} fullWidth/>}/>
                                </LocalizationProvider>  
                        </div>
                        </div><br/>
                        </Form>
                        </Fragment>
                        </DialogContent>
                        <DialogActions>
                        <Button color="error" onClick={this.handleClose}>Oткажи</Button>
                        <Button type="submit" color="success" onClick={this.handleSubmit}>Уреди</Button>
                        </DialogActions>
                </Dialog>
            )
          } else if (role==="ROLE_HEAD_OF_DEPARTMENT") {
            return (
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle style={{fontSize: "20px"}}>Уредете ја селектираната форма</DialogTitle>
                        <DialogContent>
                        <Fragment>
                        <Form>
                        <div className="row">
                        <div className="col-12">
                        <label style={{ color: '#4A4A4A', fontSize: '18px', textAlign: 'left', width:'100%' }}>Активноста е доделена на:<br/> 
                        <label style={{fontWeight:"bold"}}>{this.props.selectedTask.nameSurnames.map((user)=>{
                         return (
                        <div>{user}</div>
                        )})}</label>
                        </label>
                        </div>
                        </div><br/>
                        <div className="row">
                        <div className="col-12">
                        <label for="departments" style={{ color: '#4A4A4A', fontSize: '18px', textAlign: 'left', marginRight: '18rem' }}>Оддел:</label>
                        <select name="organizationalDepartmentId" id="departments"
                        value={this.state.data.organizationalDepartmentId}
                        className="form-control" onChange={this.handleChangeSelect}>
                            {this.state.departments.map((item) => (
                            <option value={item.id}>{item.name}</option>
                            ))}
                        </select>
                        </div>
                        </div><br/>
                        <div className="row">
                        <div className="col-12">
                        <label for="items" style={{ color: '#4A4A4A', fontSize: '18px', textAlign: 'left', marginRight: '18rem' }}>Работна задача:</label>
                        <select name="workingItemId" id="items"
                        value={this.state.data.workingItemId}
                        className="form-control" onChange={this.handleChangeSelect}>
                            {this.state.items.map((item) => (
                            <option value={item.id}>{item.name}</option>
                            ))}
                        </select>
                        </div>
                        </div><br/>
                        <div className="row">
                        <div className="col-12">
                        <label for="items" style={{ color: '#4A4A4A', fontSize: '18px', textAlign: 'left', marginRight: '18rem' }}>Име на активност:</label>
                        <input className="form-control" type="text" name="title"
                        value={this.state.data.title} onChange={this.handleChangeSelect}/>
                        </div>
                        </div><br/>
                        <div className="row">
                        <div className="col-12">
                        <label for="description" style={{ color: '#4A4A4A', fontSize: '18px', textAlign: 'left', marginRight: '18rem' }}>Опис:</label>
                        <TextareaAutosize
                                minRows={1.35}
                                maxRows={4}
                                id="description"
                                name="description"
                                aria-label="description"
                                onChange={this.handleChangeSelect}
                                style={{width: "-webkit-fill-available", boxShadow: "none", border: "1px solid #ced4da", borderRadius: "0.375rem", backgroundClip:"padding-box"}}
                                defaultValue={this.state.data.description}/>
                        </div>
                        </div><br/>
                        {/* <div className="row">
                        <div className="col-12">
                        <label for="statuses" style={{ color: '#4A4A4A', fontSize: '18px', textAlign: 'left', marginRight: '18rem' }}>Статус на активност:</label>
                        <select name="employeeTrackingFormStatusId" id="statuses"
                        value={this.state.data.employeeTrackingFormStatusId}
                        className="form-control" onChange={this.handleChangeSelect}>
                            {this.state.statuses.map((status) => (
                            <option value={status.id}>{status.label}</option>
                            ))}
                        </select>
                        </div>
                        </div><br/> */}<br/>
                        <div className="row">
                        <div className="col-6">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                disabled={true}
                                id="taskStartDate"
                                name="taskStartDate"
                                label="Почетен датум"
                                value={dateFormat(this.state.data.taskStartDate, "mm/dd/yyyy")}
                                renderInput={(params) => <TextField {...params} fullWidth sx={{'.MuiInputBase-input': {cursor:'not-allowed'},}} />}/>
                                </LocalizationProvider>  
                        </div>
                        <div className="col-6">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                id="taskEndDate"
                                name="taskEndDate"
                                label="Краен датум"
                                value={this.state.data.taskEndDate}
                                onChange={this.handleChangeDate}
                                renderInput={(params) => <TextField {...params} fullWidth/>}/>
                                </LocalizationProvider>  
                        </div>
                        </div><br/>
                        <div className="row">
                        <div className="col-12">
                            <FormControlLabel 
                            control={
                            <Checkbox checked={this.state.checked} name="checked" id="selectCheckbox"
                            onClick={() => this.setState({ checked: !this.state.checked })}/>
                            }
                            style={{marginRight:"1rem"}}
                            label="Дали сакате да ја доделите оваа задача на друг/и вработен/и?"/>
                            {this.state.checked && (
                                <div className="row">
                                <div className="col-12">
                                <CustomizedHook handleUsersChange={this.handleUsersChange}></CustomizedHook>
                                </div>
                                </div>
                            )}
                            </div>
                            </div><br/>
                        </Form>
                        </Fragment>
                        </DialogContent>
                        <DialogActions>
                        <Button color="error" onClick={this.handleClose}>Oткажи</Button>
                        <Button type="button" color="success" onClick={() => this.handleSubmit()}>Уреди</Button>
                        </DialogActions>
                </Dialog>
            )
          }
        }
    }