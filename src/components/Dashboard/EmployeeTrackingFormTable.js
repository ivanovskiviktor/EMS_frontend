import React, { Component, Fragment } from "react";
import WorkingTaskService from "../service/WorkingTaskService";
import OrganizationalDepartmentService from "../service/OrganizationalDepartmentService";
import StatusService from "../service/StatusService";
import DashboardService from "../service/DashboardService";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Button from '@mui/material/Button';
import dateFormat from "dateformat";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; 
import {faEdit, faFileExport, faNoteSticky, faPlusCircle, faPlus, faInfoCircle, faCheck, faLockOpen, faFileArchive} from "@fortawesome/free-solid-svg-icons";
import instance from "../instance/instance";
import FileSaver from "file-saver";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EmployeeTrackingFormService from "../service/EmployeeTrackingFormService";
import Swal from "sweetalert2";
import DeleteDialog from "../shared/components/Dialogs/DeleteDialog";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import EditEmployeeTrackingForm from "./EditEmployeeTrackingForm";
import CreateNote from "../Notes/CreateNote";
import CreateReport from "../Reports/CreateReport";
import {sleep} from "../shared/functions/Sleep";
import EmployeeTrackingFormPreview from "./EmployeeTrackingFormPreview";
import UpdateClosedTask from "./UpdateClosedTask";
import CloseTask from "./CloseTask";
import Select from "react-select";
import SearchBar from "../shared/components/SearchBar/SearchBar"; 
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


export default class EmployeeTrackingFormTable extends Component{

    constructor(props) {
        super(props);    
        this.state = {
          page: 0,
          rowsPerPage: 5,
          totalElements: 0,
          tableForFinishedTasks: this.props.pageForFinishedTasks,
          checked: false,
          tasks: [],
          loggUserId:null,
          loggUserName:null,
          workingTasks: [],
          departments: [],
          allDepartments: [],
          statuses: [],
          noteHelper: {
            description: ""
          },
          employeeTrackingFormHelper: {
            startDate: this.getTodaysDateFilter(),
            endDate: null,
            title: null,
            submitterFirstNameLastName: null,
            organizationalDepartmentId: null,
            description: null
          },
          orgDepartmentId: null,
          open: false
        };
      }

      colorRow(endTaskDate) {
        if (endTaskDate !== null) {
          var endDate = new Date(endTaskDate);
          var data = new Date();
          if (endDate.getTime() < data.getTime()) {
            return "#f6d0b4";
          } else {
            return "#ffffff";
          }
        } else {
          return "#ffffff";
        }
      }

      getTodaysDateFilter() {
        var date = new Date();
        date.setDate(date.getDate())
        date.setMinutes(0);
        date.setHours(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.toISOString();
      }

      showForm() {
        if (this.props.onToggleForm) {
          this.props.onToggleForm();
          this.props.func(null);
        }
      }

      handleClickOpen = () => { 
        this.setState({
            open: true
        })
    }

    handleClose = () => {
       this.setState({
            open: false
        })
    }

      exportForms = async () => {
        if(!this.state.tableForFinishedTasks) {
        await instance.post("/rest/employeeTrackingForm/exportNotDone", this.state.employeeTrackingFormHelper, {
              responseType: "blob"
            })
            .then((response) => {
              var blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8",
              });
              FileSaver.saveAs(blob, "тековни_форми.xlsx");
            })
            .catch((error) => {
              if (error.request) {
              }
            });
          } else {
            await instance.post("/rest/employeeTrackingForm/exportDone", this.state.employeeTrackingFormHelper, {
              responseType: "blob"
            })
            .then((response) => {
              var blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8",
              });
              FileSaver.saveAs(blob, "завршени_форми.xlsx");
            })
            .catch((error) => {
              if (error.request) {
              }
            });
          }
      };

      getWorkingTasks() {
        WorkingTaskService.getWorkingTasksNotPageable()
            .then((response) => response.data)
            .then((data) => {
              this.setState({
                workingTasks: data,
              });
            });
      }

      getOrganizationalDepartments(id) {
        OrganizationalDepartmentService.getDepartmentsForUser(id)
            .then((response) => response.data)
            .then((data) => {
              this.setState({
                departments: data
              });
            });
      }

      getAllDepartments() {
        OrganizationalDepartmentService.getDepartmentsNotPageable()
        .then((response) => response.data)
        .then((data) => {
          this.setState({
            allDepartments: data
          });
        });
      }

      getStatusesNotPageable() {
        StatusService.getStatusesNotPageable()
            .then((response) => response.data)
            .then((data) => {
                this.setState({
                statuses: data
                });
            });
        }

        getWorkingTasksPageable(page,size) {
            DashboardService.getWorkingTasksPageable(page, size)
                .then((response) => response.data)
                .then((data) => {
                  this.setState({
                    tasks: data.content,
                    totalElements: data.totalElements
                  });
                });
          }

           getTasksFilterable(page, size) {
             DashboardService.getTasksFilterable(page, size, this.state.employeeTrackingFormHelper)
                .then((response) => response.data)
                .then((data) => {
                  this.setState({
                    tasks: data.content,
                    totalElements: data.totalElements
                  });
                });
          }

          getFinishedTasksFilterable(page, size) {
            DashboardService.getFinishedTasksFilterable(page, size, this.state.employeeTrackingFormHelper)
               .then((response) => response.data)
               .then((data) => {
                 this.setState({
                   tasks: data.content,
                   totalElements: data.totalElements
                 });
               });
         }

          closeTask(taskId) {
           EmployeeTrackingFormService.closeTask(taskId)
              .then((res) => {
                if (this.state.tableForFinishedTasks) {
                  this.getFinishedTasksFilterable(this.state.page, this.state.rowsPerPage);
                } else {
                  this.getTasksFilterable(this.state.page, this.state.rowsPerPage);
                }
                this.handleClose();
                sleep(500);
                Swal.fire({
                  icon: "success",
                  title: "Успешно!",
                  text: "Успешно затворена задача!",
                });
              })
              .catch((error) => {
                Swal.fire({
                  icon: "error",
                  title: "Грешка!",
                  text: "Неуспешнo затворање на избраната задача!", 
                });
              });
        }

        deleteTask(taskId) {
          EmployeeTrackingFormService.deleteTask(taskId)
              .then((res) => {
                var modifiedTasks = this.state.tasks;
                for (var i = 0; i < modifiedTasks.length; i++) {
                  if (modifiedTasks[i].id === taskId) {
                    modifiedTasks.splice(i, 1);
                    break;
                  }
                }
                this.setState({
      
                  tasks: modifiedTasks,
                });
                Swal.fire({icon:"success", title:"Успешно!", text:"Успешно бришење на одбраната задача!"});
              })
              .catch((error) => {
                Swal.fire({
                  icon: "error",
                  title: "Грешка!",
                  text: "Задачата не може да се избрише бидејќи веќе има поднесено извештај за истата!",
                });
              });
        }

         handleChangePage = (event, newPage) => {
          this.setState({
            page: newPage,
          })
          if(this.props.pageForFinishedItems === true) {
            this.getFinishedTasksFilterable(newPage, this.state.rowsPerPage);
          } else {
          this.getTasksFilterable(newPage, this.state.rowsPerPage);
          }
        };
      
      handleChangeRowsPerPage = event => {
          this.setState({
            rowsPerPage: (parseInt(event.target.value, 10)),
            page: 0,
          })
          if(this.props.pageForFinishedItems === true) {
            this.getFinishedTasksFilterable(0, (parseInt(event.target.value, 10)));
          } else {
          this.getTasksFilterable(0, (parseInt(event.target.value, 10)));
          }
        };

          async componentDidMount() {
            let id = localStorage.getItem("loggedUserId");
            await this.getWorkingTasks();
            await this.getAllDepartments();
            await this.getOrganizationalDepartments(id);
            await this.getStatusesNotPageable();
            if (this.props.pageForFinishedItems === true) {
                await this.getFinishedTasksFilterable(this.state.page, this.state.rowsPerPage);    
            } else {
                await this.getTasksFilterable(this.state.page, this.state.rowsPerPage);    
            }
            

            this.setState({
                tableForFinishedTasks: this.props.pageForFinishedItems
              });

              const roleId = localStorage.getItem("loggedUserId")
          
              this.setState({
                loggUserId: roleId
              })
         }

         handleSearch = (id, value) => {
     
          let newFilter = {
              ...this.state.employeeTrackingFormHelper,
          }
          newFilter[id] = value;
          
          if(this.state.tableForFinishedTasks) {
            this.getFinishedTasksFilterable(0, this.state.rowsPerPage, newFilter)
          } else {
          this.getTasksFilterable(0, this.state.rowsPerPage, newFilter)
          }
          this.setState({
              employeeTrackingFormHelper: newFilter
          })
  
      }

      handleChangeSelect = (e) => {
        let date = new Date();
        this.setState({
            employeeTrackingFormHelper: {
            ...this.state.employeeTrackingFormHelper,
            [e.name]: e.value || null,
        },
        }, 
        () => {
          if(this.state.tableForFinishedTasks) {
            this.getFinishedTasksFilterable(0, this.state.rowsPerPage, this.state.employeeTrackingFormHelper)
          } else {
          this.getTasksFilterable(0, this.state.rowsPerPage, this.state.employeeTrackingFormHelper);
        }
      }
        );
      }

      handleChangeStartDate = (newValue) => {
        this.setState({
            employeeTrackingFormHelper: {
                ...this.state.employeeTrackingFormHelper,
                startDate: newValue.$d
            }
        },
        () => {
          if(this.state.tableForFinishedTasks) {
            this.getFinishedTasksFilterable(0, this.state.rowsPerPage, this.state.employeeTrackingFormHelper)
          } else {
          this.getTasksFilterable(0, this.state.rowsPerPage, this.state.employeeTrackingFormHelper);
        }
        })
    };

    handleChangeEndDate = (newValue) => {
      this.setState({
          employeeTrackingFormHelper: {
              ...this.state.employeeTrackingFormHelper,
              endDate: newValue.$d
          }
      },
      () => {
        if(this.state.tableForFinishedTasks) {
          this.getFinishedTasksFilterable(0, this.state.rowsPerPage, this.state.employeeTrackingFormHelper)
        } else {
        this.getTasksFilterable(0, this.state.rowsPerPage, this.state.employeeTrackingFormHelper);
      }
      })
  };



    render() {
        const { tasks, employeeTrackingFormHelper, noteHelper } = this.state;
        let role = localStorage.getItem("ROLES");
        let loggedUserId = localStorage.getItem("loggedUserId");
        if(role !== "ROLE_ADMIN"){
        return (
            <Fragment>
              <br/>
               <div>
               <button type="submit" style={{display:"inline-block", float: "left", marginLeft:"0.5rem"}} class="btn btn-success" onClick={this.exportForms}>
                <FontAwesomeIcon icon={faFileExport}/> <span className="btn-wrapper--label">Превземи форми</span></button>
                {!this.state.tableForFinishedTasks && 
               <button type="submit" style={{display:"inline-block", float: "left", marginLeft: "0.5rem"}} class="btn btn-warning" onClick={е=>confirmAlert({
                          customUI: ({ onClose }) => {
                          return (
                          <CreateNote onClose={() => {
                            onClose();
                            this.getTasksFilterable(this.state.page, this.state.rowsPerPage); }} />       
                             );
                          },
                          closeOnEscape: true,
                          closeOnClickOutside: false,
                          willUnmount: () => {},
                          afterClose: () => {},
                          onClickOutside: () => {},
                          onKeypressEscape: () => {}})}>
                <FontAwesomeIcon icon={faNoteSticky}/> <span className="btn-wrapper--label">Постави забелешка</span></button>}
               </div><br/>
               <TableContainer className="mt-4" component={Paper}>
                <Table className="table-striped table-hover" aria-label="simple table">
                  <TableHead className="tableHead" style={{backgroundColor:"#B6B9DC"}}>
                  <TableRow>
                      <TableCell width="10%">Статус</TableCell>
                      <TableCell width="18%">Име на активност</TableCell>
                      <TableCell width="12%">Опис</TableCell>
                      <TableCell width="10%">Оддел</TableCell>
                      <TableCell width="15%">Име и презиме</TableCell>
                      <TableCell width="10%">Почетен датум</TableCell>
                      <TableCell width="10%">Краен датум</TableCell>
                      {!this.state.tableForFinishedTasks && (
                      <TableCell width="15%" align="right">
                      <button type="submit" class="btn btn-success" onClick={() => { this.showForm(); }}><FontAwesomeIcon icon={faPlusCircle}/> <span className="btn-wrapper--label">Додади форма</span> </button>
                      </TableCell>)}
                      {this.state.tableForFinishedTasks && (
                        <TableCell width="15%"></TableCell>
                      )}
                    </TableRow>
                      <TableRow style={{backgroundColor:"#B6B9DC"}}>
                      <TableCell width="10%"></TableCell>
                      <TableCell width="18%">
                      <SearchBar handleSearch={this.handleSearch} id="title"/></TableCell>
                      <TableCell width="12%">
                      <SearchBar handleSearch={this.handleSearch} id="description"/></TableCell>
                      <TableCell width="10%">
                      <Select placeholder={this.state.departments[0]?.code} className="form-control" id="departments" onChange={this.handleChangeSelect}
                                    options={this.state.departments.map((department) => (
                                        { value: department.id, label: department.code, name: "organizationalDepartmentId" }
                                    ))}
                                    styles={{
                                        control: (provided) => ({
                                        ...provided,
                                        boxShadow: "none",
                                        border: "none",
                                        height: "10px"
                                        }),
                                        valueContainer: (provided, state) => ({
                                          ...provided,
                                          height: '34px'
                                        }),
                                    
                                    }}>
                                    </Select>
                      </TableCell>
                      <TableCell width="15%">
                      <SearchBar handleSearch={this.handleSearch} id="submitterFirstNameLastName"/></TableCell>
                      <TableCell width="10%">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                id="taskStartDate"  
                                name="taskStartDate"
                                value={dateFormat(this.state.employeeTrackingFormHelper.startDate, "mm/dd/yyyy")}
                                onChange={this.handleChangeStartDate}
                                renderInput={(params) => <TextField {...params} fullWidth sx={{ backgroundColor: 'white' }}
                                />}/>
                      </LocalizationProvider></TableCell>
                      {this.state.tableForFinishedTasks && 
                      <TableCell width="10%">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                id="taskEndDate"  
                                name="taskEndDate"
                                value={dateFormat(this.state.employeeTrackingFormHelper.endDate, "mm/dd/yyyy")}
                                onChange={this.handleChangeEndDate}
                                renderInput={(params) => <TextField {...params} fullWidth sx={{ backgroundColor: 'white' }}
                                />}/>
                      </LocalizationProvider></TableCell>
                      }
                      {!this.state.tableForFinishedTasks &&
                      <TableCell width="10%"></TableCell>
                      }
                      <TableCell width="15%"></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {tasks.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={12} style={{ "text-align": "center" }}>Нема {this.state.tableForFinishedTasks ? "завршени" : "тековни"} форми на задачи</TableCell>
                      </TableRow>
                    )}
                    {(this.state.tasks).map((task, index) =>
                      <TableRow key={task.id} style={{ backgroundColor: this.colorRow(task.endDate) }}>
                        <TableCell>{task.statusName}</TableCell>
                        <TableCell>{task.title && task.title.length <= 30 ? <b>{task.title}</b> : 
                          `${task.title.substring(0,30)}`}
                          {task.title.length > 30 && (<a style={{cursor: "cell"}} 
                          onClick={this.handleClickOpen}>...&nbsp;<FontAwesomeIcon icon={faPlus}/></a>)}
                          {task.title.length > 30 && ( 
                            <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title"> {"Целосно име на задачата од поднесената форма"} </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                  <b>{task.title}</b>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button color="error" onClick={this.handleClose}>Затвори</Button>
                            </DialogActions>
                            </Dialog>
                           )}</TableCell>
                        <TableCell>{task.employeeTrackingFormDescription && task.employeeTrackingFormDescription.length <= 20 ? task.employeeTrackingFormDescription : 
                          `${task.employeeTrackingFormDescription.substring(0,20)}`}
                          {task.employeeTrackingFormDescription.length > 20 && (<a style={{cursor: "cell"}} 
                          onClick={this.handleClickOpen}>...&nbsp;<FontAwesomeIcon icon={faPlus}/></a>)}
                          {task.employeeTrackingFormDescription.length > 20 && ( 
                            <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title"> {"Целосен опис на задачата од поднесената форма"} </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                  {task.employeeTrackingFormDescription}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button color="error" onClick={this.handleClose}>Затвори</Button>
                            </DialogActions>
                            </Dialog>
                           )}</TableCell>
                        <TableCell>{task.organizationalDepCode}</TableCell>
                        <TableCell>{task.creatorName} {task.creatorSurname}</TableCell>
                        <TableCell>{dateFormat(task.startDate, "dd/mm/yyyy")}</TableCell>
                        <TableCell>{task.endDate !== null ? dateFormat(task.endDate, "dd/mm/yyyy") : ""}</TableCell>
                        {this.state.tableForFinishedTasks && (
                          <TableCell>
                            <button type="submit" class="btn btn-warning" onClick={е=>confirmAlert({
                          customUI: ({ onClose }) => {
                          return (
                          <EmployeeTrackingFormPreview task={task}
                            onClose={() => {
                            onClose();
                            this.getFinishedTasksFilterable(this.state.page, this.state.rowsPerPage); }} />       
                             );
                          },
                          closeOnEscape: true,
                          closeOnClickOutside: false,
                          willUnmount: () => {},
                          afterClose: () => {},
                          onClickOutside: () => {},
                          onKeypressEscape: () => {}})}><FontAwesomeIcon icon={faInfoCircle}/></button>&nbsp;&nbsp;&nbsp;
                          {role === "ROLE_HEAD_OF_DEPARTMENT" && (
                            <button type="button" class="btn btn-warning" onClick={е=>confirmAlert({
                          customUI: ({ onClose }) => {
                          return (
                          <UpdateClosedTask task={task} onUpdateTask={() => {
                            this.getFinishedTasksFilterable(this.state.page, this.state.rowsPerPage);
                          }}
                            onClose={() => {
                            onClose();
                            this.getFinishedTasksFilterable(this.state.page, this.state.rowsPerPage); }} />       
                             );
                          },
                          closeOnEscape: true,
                          closeOnClickOutside: false,
                          willUnmount: () => {},
                          afterClose: () => {},
                          onClickOutside: () => {},
                          onKeypressEscape: () => {}})}><FontAwesomeIcon icon={faLockOpen}/></button>
                          )}
                          </TableCell>
                        )}
                        {!this.state.tableForFinishedTasks && (
                          <TableCell>
                            <button type="button" class="btn btn-success" onClick={е=>confirmAlert({
                          customUI: ({ onClose }) => {
                          return (
                          <CloseTask task={task} onCloseTask={() => {
                            this.getTasksFilterable(this.state.page, this.state.rowsPerPage);
                          }}
                            onClose={() => {
                            onClose();
                            this.getTasksFilterable(this.state.page, this.state.rowsPerPage); }} />       
                             );
                          },
                          closeOnEscape: true,
                          closeOnClickOutside: false,
                          willUnmount: () => {},
                          afterClose: () => {},
                          onClickOutside: () => {},
                          onKeypressEscape: () => {}})}><FontAwesomeIcon icon={faCheck}/></button>&nbsp;&nbsp;
                        <button type="button" class="btn btn-warning" onClick={е=>confirmAlert({
                          customUI: ({ onClose }) => {
                          return (
                          <EditEmployeeTrackingForm tasks={tasks} selectedTask={task} onSave={() => {
                                     this.getTasksFilterable(this.state.page,this.state.rowsPerPage); 
                                     onClose();
                                }} />       
                             );
                          },
                          closeOnEscape: true,
                          closeOnClickOutside: false,
                          willUnmount: () => {},
                          afterClose: () => {},
                          onClickOutside: () => {},
                          onKeypressEscape: () => {}})}><FontAwesomeIcon icon={faEdit}/></button>&nbsp;&nbsp;
                        <DeleteDialog handleDelete={() => this.deleteTask(task.id)}/>&nbsp;&nbsp;
                        <button type="button" class={task.hasReport && task.creatorId !== loggedUserId ? "btn btn-danger" : "btn btn-success"} onClick={е=>confirmAlert({
                          customUI: ({ onClose }) => {
                          return (
                          <CreateReport task={task.id} report={task.reportId} title={task.title}
                            onClose={() => {
                            onClose();
                            this.getTasksFilterable(this.state.page, this.state.rowsPerPage); }} />       
                             );
                          },
                          closeOnEscape: true,
                          closeOnClickOutside: false,
                          willUnmount: () => {},
                          afterClose: () => {},
                          onClickOutside: () => {},
                          onKeypressEscape: () => {}})}><FontAwesomeIcon icon={faFileArchive}
                          style={{cursor: task.hasReport ? "not-allowed" : "pointer"}}/></button>
                          </TableCell>
                        )}
                      </TableRow>
                    )}
                    </TableBody>
                    <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        colSpan={12}
                        count={this.state.tasks.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        SelectProps={{
                          inputProps: {'aria-label': 'rows per page'},
                          native: true
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      />
                    </TableRow>
                  </TableFooter>
                    </Table>
                    </TableContainer>
            </Fragment>
        );
        } else {
            return (
              <Fragment>
              <br/>
               <div>
               <button type="submit" style={{display:"inline-block", float: "left", marginLeft:"0.5rem"}} class="btn btn-success" onClick={this.exportForms}>
                <FontAwesomeIcon icon={faFileExport}/> <span className="btn-wrapper--label">Превземи форми</span></button>
               </div><br/>
               <TableContainer className="mt-4" component={Paper}>
                <Table className="table-striped table-hover" aria-label="simple table">
                  <TableHead className="tableHead" style={{backgroundColor:"#B6B9DC"}}>
                  <TableRow>
                      <TableCell width="10%">Статус</TableCell>
                      <TableCell width="18%">Име на активност</TableCell>
                      <TableCell width="12%">Опис</TableCell>
                      <TableCell width="10%">Оддел</TableCell>
                      <TableCell width="15%">Име и презиме</TableCell>
                      <TableCell width="10%">Почетен датум</TableCell>
                      <TableCell width="10%">Краен датум</TableCell>
                        <TableCell width="15%"></TableCell>
                    </TableRow>
                    <TableRow style={{backgroundColor:"#B6B9DC"}}>
                      <TableCell width="10%"></TableCell>
                      <TableCell width="18%">
                      <SearchBar handleSearch={this.handleSearch} id="title"/></TableCell>
                      <TableCell width="12%">
                      <SearchBar handleSearch={this.handleSearch} id="description"/></TableCell>
                      <TableCell width="10%">
                      <Select placeholder={this.state.allDepartments[0]?.code} className="form-control" id="departments" onChange={this.handleChangeSelect}
                                    options={this.state.allDepartments.map((department) => (
                                        { value: department.id, label: department.code, name: "organizationalDepartmentId" }
                                    ))}
                                    styles={{
                                        control: (provided) => ({
                                        ...provided,
                                        boxShadow: "none",
                                        border: "none",
                                        height: "10px"
                                        }),
                                        valueContainer: (provided, state) => ({
                                          ...provided,
                                          height: '34px'
                                        }),
                                    
                                    }}>
                                    </Select>
                      </TableCell>
                      <TableCell width="15%">
                      <SearchBar handleSearch={this.handleSearch} id="submitterFirstNameLastName"/></TableCell>
                      <TableCell width="10%">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                id="taskStartDate"  
                                name="taskStartDate"
                                value={dateFormat(this.state.employeeTrackingFormHelper.startDate, "mm/dd/yyyy")}
                                onChange={this.handleChangeStartDate}
                                renderInput={(params) => <TextField {...params} fullWidth sx={{ backgroundColor: 'white' }}
                                />}/>
                      </LocalizationProvider></TableCell>
                      {this.state.tableForFinishedTasks && 
                      <TableCell width="10%">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                id="taskEndDate"  
                                name="taskEndDate"
                                value={dateFormat(this.state.employeeTrackingFormHelper.endDate, "mm/dd/yyyy")}
                                onChange={this.handleChangeEndDate}
                                renderInput={(params) => <TextField {...params} fullWidth sx={{ backgroundColor: 'white' }}
                                />}/>
                      </LocalizationProvider></TableCell>
                      }
                      {!this.state.tableForFinishedTasks &&
                      <TableCell width="10%"></TableCell>
                      }
                      <TableCell width="15%"></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {tasks.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={12} style={{ "text-align": "center" }}>Нема {this.state.tableForFinishedTasks ? "завршени" : "тековни"} форми на задачи</TableCell>
                      </TableRow>
                    )}
                    {(this.state.tasks).map((task, index) =>
                      <TableRow key={task.id} style={{ backgroundColor: this.colorRow(task.endDate) }}>
                        <TableCell>{task.statusName}</TableCell>
                        <TableCell>{task.title && task.title.length <= 30 ? <b>{task.title}</b> : 
                          `${task.title.substring(0,30)}`}
                          {task.title.length > 30 && (<a style={{cursor: "cell"}} 
                          onClick={this.handleClickOpen}>...&nbsp;<FontAwesomeIcon icon={faPlus}/></a>)}
                          {task.title.length > 30 && ( 
                            <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title"> {"Целосно име на задачата од поднесената форма"} </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                  <b>{task.title}</b>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button color="error" onClick={this.handleClose}>Затвори</Button>
                            </DialogActions>
                            </Dialog>
                           )}</TableCell>
                        <TableCell>{task.employeeTrackingFormDescription && task.employeeTrackingFormDescription.length <= 20 ? task.employeeTrackingFormDescription : 
                          `${task.employeeTrackingFormDescription.substring(0,20)}`}
                          {task.employeeTrackingFormDescription.length > 20 && (<a style={{cursor: "cell"}} 
                          onClick={this.handleClickOpen}>...&nbsp;<FontAwesomeIcon icon={faPlus}/></a>)}
                          {task.employeeTrackingFormDescription.length > 20 && ( 
                            <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title"> {"Целосен опис на задачата од поднесената форма"} </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                  {task.employeeTrackingFormDescription}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button color="error" onClick={this.handleClose}>Затвори</Button>
                            </DialogActions>
                            </Dialog>
                           )}</TableCell>
                        <TableCell>{task.organizationalDepCode}</TableCell>
                        <TableCell>{task.creatorName} {task.creatorSurname}</TableCell>
                        <TableCell>{dateFormat(task.startDate, "dd/mm/yyyy")}</TableCell>
                        <TableCell>{task.endDate !== null ? dateFormat(task.endDate, "dd/mm/yyyy") : ""}</TableCell>
                          <TableCell>
                            <button type="submit" class="btn btn-warning" onClick={е=>confirmAlert({
                          customUI: ({ onClose }) => {
                          return (
                          <EmployeeTrackingFormPreview task={task}
                            onClose={() => {
                            onClose();
                            this.getFinishedTasksFilterable(this.state.page, this.state.rowsPerPage); }} />       
                             );
                          },
                          closeOnEscape: true,
                          closeOnClickOutside: false,
                          willUnmount: () => {},
                          afterClose: () => {},
                          onClickOutside: () => {},
                          onKeypressEscape: () => {}})}><FontAwesomeIcon icon={faInfoCircle}/></button>
                          </TableCell>
                      </TableRow>
                    )}
                    </TableBody>
                    <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        colSpan={12}
                        count={this.state.tasks.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        SelectProps={{
                          inputProps: {'aria-label': 'rows per page'},
                          native: true
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      />
                    </TableRow>
                  </TableFooter>
                    </Table>
                    </TableContainer>
            </Fragment>
            )
        }
    }
}