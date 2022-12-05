        import React, {Fragment} from "react";
        import NavBar from "../shared/components/NavBar/NavBar";
        import ReportService from "../service/ReportService";
        import UserService from "../service/UserService";
        import {
          Paper,
          Table,
          TableBody,
          TableCell,
          TableContainer,
          TableHead,
          TableRow,
        } from "@material-ui/core";
        import Swal from "sweetalert2";
        import dateFormat from "dateformat";
        import Select from "react-select";
        import TextField from '@mui/material/TextField';
        import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
        import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
        import { DatePicker } from '@mui/x-date-pickers/DatePicker';
        import { PickersDay } from '@mui/x-date-pickers/PickersDay';
        import Form from "react-bootstrap/Form";
        import { Pagination } from "@material-ui/lab";
        import Badge from "@material-ui/core/Badge";
        import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
        import { faCheck } from "@fortawesome/free-solid-svg-icons";
        import Checkbox from '@mui/material/Checkbox';
        import FormControlLabel from '@mui/material/FormControlLabel';

        export default class ReportList extends React.Component {

            constructor(props) {


                super(props);
                this.state = {
                  checked: false,
                  approveAll: false,
                  approvedByMe: true,
                  data: [],
                  tasks: [],
                  reports: [],
                  unapprovedReports: [],
                  nameSurname: [],
                  reportIds: [],
                  usersForHead: [],
                  otherUsers: [],
                  allUsers: [],
                  currentPage: 1,
                  recordPerPage: 5,
                  minutes: null,
                  hours: null,
                  reportHelper: {
                    startDate: null,
                    endDate: null,
                    submissionDate: null,
                    firstName: null,
                    lastName: null,
                    employeeTrackingFormId: null,
                    taskDescription: null,
                    workingItemName: null,
                    isAccepted: null
                  },
                  reportFilter: {
                    startDate: this.getTodaysDateFilter(),
                    endDate: null,
                    description: null,
                    submitterFirstNameLastName: null,
                    approverFirstNameLastName: null
                  }
                };
                this.handlePageChange = this.handlePageChange.bind(this);
              }

              styles = {
                control: (provided) => ({
                  ...provided,
                  boxShadow: "none",
                  border: "none",
                  borderBottom: "1px solid gray",
                  marginTop: "2.5rem",
                  marginLeft: "2rem"
                }),
                option: (styles, {data}) =>  {
                  return {
                  ...styles,
                  fontWeight: data.isBold ? "bold" : "normal"
                }
                }   
              }

              getSubmitterFullNames = () => {
                let submitters = [];
                for (var i=0; i<this.state.unapprovedReports.length; i++)
                {
                  submitters.push(this.state.unapprovedReports[i]?.submitterFirstNameLastName);
                }
                this.setState({
                  nameSurname: submitters
                })
              }

              async componentWillMount() {
                await ReportService.getNotApprovedReportsForLoggedUser()
                .then((response) => response.data)
                .then((data) => {
                    this.setState({
                      unapprovedReports: data
                  },
                  () => { 
                    this.getSubmitterFullNames();
                  }
                  )
                })
              };

              componentDidMount() {
                if(localStorage.getItem("ROLES") === "ROLE_HEAD_OF_DEPARTMENT"){
                this.getAllApprovedUsersByLoggedHeadUser();
                }
                if(localStorage.getItem("ROLES") === "ROLE_EMPLOYEE"){
                this.getReportsPageable(1);
                }
                if(localStorage.getItem("ROLES") === "ROLE_ADMIN"){
                  this.getReportsForAdminPageable(1);
                }
              }

              getAllApprovedUsersByLoggedHeadUser() {
                UserService.getAllApprovedUsersByLoggedHeadUser()
                  .then((response) => response.data)
                  .then((data) => {
                    let obj = {
                      startDate: this.state.reportFilter.startDate,
                      endDate: null,
                      description: null,
                      submitterFirstNameLastName: data[0].person.firstName + " " + data[0].person.lastName,
                      approverFirstNameLastName: null
                    }
                    if(this.state.currentPage > 1)
                    {
                      var current = 0;
                    } else if(this.state.currentPage === 1) 
                    {
                      var current = this.state.currentPage - 1;
                    }
                    ReportService.getReportsPageable(current, this.state.recordPerPage, obj, true)
                      .then((response2) => response2.data)
                      .then((data2) => {
                        ReportService.timeSpentOnReportsByUser(obj)
                          .then((response3) => response3.data)
                          .then((data3) => {
                            let newUsers = []
                            data.forEach(item => {
                              newUsers.push({...item, isBold: this.checkIfUserReportsNeedToBeApproved(item)})
                            })
                            this.setState({
                              reportFilter : {
                                ...this.state.reportFilter,
                                submitterFirstNameLastName: data[0].person.firstName + " " + data[0].person.lastName
                              },
                              usersForHead: newUsers, 
                              initialRender: false,
                              reports: data2.content,
                              totalPages: data2.totalPages,
                              totalElements: data2.totalElements,
                              hours: data3.hours,
                              minutes:data3.minutes
                            });
                          })
                      });
                  });
              }

                getReportsPageable(currentPage) {
                let current = currentPage - 1;
                ReportService.getReportsPageable(current, this.state.recordPerPage, this.state.reportFilter, this.state.approvedByMe)
                .then((response) => response.data)
                .then((data) => {
                  this.setState({
                    reports: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1,
                  });
                });
          
            }

            getReportsForAdminPageable(currentPage) {
              UserService.getAllUsers()
                .then((response) => response.data)
                .then((data) => {
                  let obj = { 
                    startDate: this.state.reportFilter.startDate,
                    endDate: null,
                    description: this.state.reportFilter.description,
                    submitterFirstNameLastName: data[0].nameSurname,
                    approverFirstNameLastName: this.state.reportFilter.approverFirstNameLastName
                  }
                  if(currentPage > 1)
                  {
                    var current = 0;
                  } else if(currentPage === 1) 
                  {
                    var current = currentPage - 1;
                  }
                  ReportService.getReportsPageable(current, this.state.recordPerPage, obj, false)
                    .then((response2) => response2.data)
                    .then((data2) => {
                          this.setState({
                            reportFilter : {
                              ...this.state.reportFilter,
                              submitterFirstNameLastName: data[0].nameSurname
                            },
                            allUsers: data,
                            reports: data2.content,
                            totalPages: data2.totalPages,
                            totalElements: data2.totalElements,
                            currentPage: data2.number + 1,
                          });
                        })
                    });
            }

            checkIfUserReportsNeedToBeApproved(user){
              let currentSelectedDate = this.state.reportFilter.startDate;
              if(!(currentSelectedDate instanceof Date)){
                currentSelectedDate = this.state.reportFilter.startDate.split("T")[0]
              }
              else {
                currentSelectedDate = `${currentSelectedDate.getFullYear()}-${String(currentSelectedDate.getMonth()+1).padStart(2,'0')}-${String(currentSelectedDate.getDate()).padStart(2, '0')}`
              }
            
              return this.state.unapprovedReports.findIndex(el => el.submissionDate.split("T")[0] == currentSelectedDate && el.submitter == user.email) >= 0
            }

            getReportsPageableAndFilterable(currentPage) {
              let obj = {
                    startDate: this.state.reportFilter.startDate,
                    endDate: null,
                    description: this.state.reportFilter.description,
                    submitterFirstNameLastName: this.state.reportFilter.submitterFirstNameLastName,
                    approverFirstNameLastName: this.state.reportFilter.approverFirstNameLastName
              }
              if(currentPage > 1)
              {
                var current = 0;
              } else if(currentPage === 1) 
              {
                var current = currentPage - 1;
              }
                ReportService.getReportsPageable(current, this.state.recordPerPage, obj, this.state.approvedByMe)
              .then((response) => response.data)
                    .then((data) => {
                      ReportService.timeSpentOnReportsByUser(obj)
                        .then((response2) => response2.data)
                        .then((data2) => {
                          let users = this.state.usersForHead
                          let newUsers = []
                          users.forEach(item => {
                            newUsers.push({...item, isBold: this.checkIfUserReportsNeedToBeApproved(item)})
                          })
                          this.setState({
                            usersForHead: newUsers,
                            initialRender: false,
                            reports: data.content,
                            totalPages: data.totalPages,
                            totalElements: data.totalElements,
                            currentPage: data.number + 1,
                            hours: data2.hours,
                            minutes:data2.minutes
                          });
                        })
                    });
            }

            getReportsPageableAndFilterablePageChange(currentPage) {
              let obj = {
                    startDate: this.state.reportFilter.startDate,
                    endDate: null,
                    description: this.state.reportFilter.description,
                    submitterFirstNameLastName: this.state.reportFilter.submitterFirstNameLastName,
                    approverFirstNameLastName: this.state.reportFilter.approverFirstNameLastName
              }
              currentPage = currentPage - 1;
              ReportService.getReportsPageable(currentPage, this.state.recordPerPage, obj, this.state.approvedByMe)
              .then((response) => response.data)
                    .then((data) => {
                      ReportService.timeSpentOnReportsByUser(obj)
                        .then((response2) => response2.data)
                        .then((data2) => {
                          let users = this.state.usersForHead
                          let newUsers = []
                          users.forEach(item => {
                            newUsers.push({...item, isBold: this.checkIfUserReportsNeedToBeApproved(item)})
                          })
                          this.setState({
                            usersForHead: newUsers,
                            initialRender: false,
                            reports: data.content,
                            totalPages: data.totalPages,
                            totalElements: data.totalElements,
                            hours: data2.hours,
                            minutes:data2.minutes
                          });
                        })
                    });
            }
          
            getReportsPageableAndFilterableForAdmin(currentPage) {
              let obj = {
                    startDate: this.state.reportFilter.startDate,
                    endDate: null,
                    description: this.state.reportFilter.description,
                    submitterFirstNameLastName: this.state.reportFilter.submitterFirstNameLastName,
                    approverFirstNameLastName: this.state.reportFilter.approverFirstNameLastName
              }
              if(currentPage > 1)
              {
                var current = 0;
              } else if(currentPage === 1) 
              {
                var current = currentPage - 1;
              }
                ReportService.getReportsPageable(current, this.state.recordPerPage, obj, false)
              .then((response) => response.data)
                    .then((data) => {
                          this.setState({
                            reports: data.content,
                            totalPages: data.totalPages,
                            totalElements: data.totalElements,
                            currentPage: data.number + 1
                          });
                    });
            }

            getReportsPageableAndFilterableForAdminPageChange(currentPage) {
              let obj = {
                    startDate: this.state.reportFilter.startDate,
                    endDate: null,
                    description: this.state.reportFilter.description,
                    submitterFirstNameLastName: this.state.reportFilter.submitterFirstNameLastName,
                    approverFirstNameLastName: this.state.reportFilter.approverFirstNameLastName
              }
              currentPage = currentPage - 1;
                ReportService.getReportsPageable(currentPage, this.state.recordPerPage, obj, false)
              .then((response) => response.data)
                    .then((data) => {
                          this.setState({
                            reports: data.content,
                            totalPages: data.totalPages,
                            totalElements: data.totalElements
                          });
                    });
            }

            findAllUsersWithSameOrganizationalUnitAndNotApprovedByHead() {
              UserService.findAllUsersWithSameOrganizationalUnitAndNotApprovedByHead()
                .then((response) => response.data)
                .then((data) => {
                  let obj = {
                    startDate: this.state.reportFilter.startDate,
                    endDate: null,
                    description: null,
                    submitterFirstNameLastName: data[0].person.firstName + " " + data[0].person.lastName,
                    approverFirstNameLastName: null
                  }
                  if(this.state.currentPage > 1)
                  {
                    var current = 0;
                  } else if(this.state.currentPage === 1) 
                  {
                    var current = this.state.currentPage - 1;
                  }
                  ReportService.getReportsPageable(current, this.state.recordPerPage, obj, false)
                    .then((response2) => response2.data)
                    .then((data2) => {
                      ReportService.timeSpentOnReportsByUser(obj)
                        .then((response3) => response3.data)
                        .then((data3) => {
                          this.setState({ 
                            reportFilter: {
                              ...this.state.reportFilter,
                              submitterFirstNameLastName: data[0].person.firstName + " " + data[0].person.lastName,
                            },
                            otherUsers: data,
                            reports: data2.content,
                            totalPages: data2.totalPages,
                            totalElements: data2.totalElements,
                            currentPage: data2.number + 1,
                            initialRender: false,
                            minutes: data3.minutes,
                            hours: data3.hours
                          });
                        });
                    });
                });
            }

            getUnapprovedReports = () => {
              ReportService.getNotApprovedReportsForLoggedUser()
              .then((response) => response.data)
              .then((data) => {
                this.setState({
                  unapprovedReports: data,
                })
            })
          }

              getTodaysDateFilter(flag) {
                var date = new Date();
                date.setDate(date.getDate())
                date.setMinutes(0);
                date.setHours(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                return date.toISOString();
              }

              approveReport = async (e) => {
                
                const reportIdsHelper = {
                  reportIds: this.state.reportIds
                }
                e.preventDefault();
                if (this.state.reportIds.length !== 0) {
                  await ReportService.acceptReport(reportIdsHelper).then((res) => {
                    Swal.fire({
                      icon: 'success',
                      title: 'Успешно!',
                      text: ' Селектираните извештаи се одобрени!',
                    })
                  }).catch(error => {
                    Swal.fire({
                      icon: 'error',
                      title: 'Грешка!',
                      text: 'Неуспешно менување на статус!',
                    })
                  }).then(() => {
                    this.setState({
                      reportIds: [],
                      approveAll: false
                    })
                    this.getReportsPageableAndFilterable(1);
                    this.getUnapprovedReports();
                  })
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Грешка!',
                    text: 'Немате селектирано ниеден извештај за одобрување!',
                  })
                }
              }

              handleSelect = (e) => {
                this.setState({
                  reportFilter: {
                    ...this.state.reportFilter,
                    [e.name]: e.label || null
                  },
                },
                () => { 
                  if(localStorage.getItem("ROLES") === "ROLE_ADMIN"){
                  this.getReportsPageableAndFilterableForAdmin(this.state.currentPage);}
                  else if(localStorage.getItem("ROLES") === "ROLE_HEAD_OF_DEPARTMENT"){
                  this.getReportsPageableAndFilterable(this.state.currentPage);}
                }
                );
                
              }

              handleSelectAll = (e) => {
                var selectedReports = document.getElementsByClassName("checkbox-reports");
                if (e.target.checked) {
                  this.state.reports.filter((report => report.approveByMe === true && report.approver === null)).map(filteredReport => {
                    this.state.reportIds.push(filteredReport.id);
            
                  })
            
                  for (var i = 0; i < selectedReports.length; i++) {
                    selectedReports[i].checked = true;
                  }
            
                } else {
                  this.setState({
                    reportIds: []
                  })
                  for (var i = 0; i < selectedReports.length; i++) {
                    selectedReports[i].checked = false;
                  }
                }
              }

              handleCheckBox = (e) => {
                if (e.target.checked) {
                  if (!this.state.reportIds.includes(e.target.value)) {
                    this.setState(prevState => ({ reportIds: [...prevState.reportIds, e.target.value] }))
                  }
                } else {
                  this.setState(prevState => ({ reportIds: prevState.reportIds.filter(r => r !== e.target.value) }));
                }
              }

              handleSearch = (e) => {
                this.setState({
                  reportFilter: {
                    ...this.state.reportFilter,
                    [e.target.name]: e.target.value || null,
                  },
                  
                },
                () => { 
                  if(localStorage.getItem("ROLES") === "ROLE_ADMIN") {
                    this.getReportsPageableAndFilterableForAdmin(this.state.currentPage);}
                    else if(localStorage.getItem("ROLES") === "ROLE_HEAD_OF_DEPARTMENT"){
                    this.getReportsPageableAndFilterable(this.state.currentPage);}
                    else if(localStorage.getItem("ROLES") === "ROLE_EMPLOYEE"){
                    this.getReportsPageable(this.state.currentPage);}
                });
              }
            
              handleChangeStartDate = (newValue) => {
                this.setState({
                  reportFilter: {
                        ...this.state.reportFilter,
                        startDate: newValue.$d
                    }
                },
                () => {
                  if(localStorage.getItem("ROLES") === "ROLE_ADMIN"){
                  this.getReportsPageableAndFilterableForAdmin(this.state.currentPage);}
                  else if(localStorage.getItem("ROLES") === "ROLE_HEAD_OF_DEPARTMENT"){
                  this.getReportsPageableAndFilterable(this.state.currentPage);}
                  else if(localStorage.getItem("ROLES") === "ROLE_EMPLOYEE"){
                  this.getReportsPageable(this.state.currentPage);}
                })
            };

    handlePageChange(event, value) {
      this.setState(
        {
          currentPage: value,
          approveAll: false,
          reportIds: []
        },
        () => {
          if(localStorage.getItem("ROLES") === "ROLE_ADMIN") {
          this.getReportsPageableAndFilterableForAdminPageChange(value);}
          else if(localStorage.getItem("ROLES") === "ROLE_HEAD_OF_DEPARTMENT"){
          this.getReportsPageableAndFilterablePageChange(value);}
          else if(localStorage.getItem("ROLES") === "ROLE_EMPLOYEE"){
          this.getReportsPageable(value);}
        }
      );
    }

            render() {
              let role = localStorage.getItem("ROLES"); 
              if(role === "ROLE_ADMIN") {
                return (
                    <Fragment>
                    <NavBar/>
                    <h2 style={{marginTop:"2rem"}}>Извештаи</h2><br/><br/><br/>
                    <div>
                      <div className="row">
                        <div className="col-2" style={{marginLeft:"1rem", marginTop: '1.41rem'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DatePicker
                                      id="startDate"  
                                      name="startDate"
                                      label={"Датум на поднесување"}
                                      value={dateFormat(this.state.reportFilter.startDate, "mm/dd/yyyy")}
                                      onChange={this.handleChangeStartDate}
                                      renderInput={(params) => <TextField {...params} fullWidth sx={{ backgroundColor: 'white' }}
                                      />}/>
                            </LocalizationProvider>
                        </div>
                        <div className="col-2">
                        <Form.Group>
                      <input
                        name="description"
                        id="description"
                        value={this.state.reportFilter.description}
                        type="text"
                        className="form-control"
                        style={{ border: 0, borderBottom: "1px solid gray", marginTop: "2.55rem", marginLeft: "1rem" }}
                        placeholder="Опис на извештај..."
                        onChange={this.handleSearch}

                      />
                    </Form.Group>
                        </div>
                        <div className="col-2">
                        <Select
                              placeholder={this.state.allUsers[0]?.nameSurname}
                              options={
                              this.state.allUsers.map((item) => (
                                { value: item.id, label: item.nameSurname, name: "submitterFirstNameLastName" }
                                ))}
                              onChange={this.handleSelect}
                              styles={{
                                control: (provided) => ({
                                  ...provided,
                                  boxShadow: "none",
                                  border: "none",
                                  borderBottom: "1px solid gray",
                                  marginTop: "2.5rem",
                                  marginLeft: "2rem",
                                  height: "2rem"
                                })
                              }}/>
                        </div>
                        <div className="col-2">
                        <Form.Group>
                    <input
                      name="approverFirstNameLastName"
                      id="approverFirstNameLastName"
                      value={this.state.reportFilter.approverFirstNameLastName}
                      type="text"
                      className="form-control mb-1"
                      style={{ border: 0, borderBottom: "1px solid gray", marginTop: "2.55rem", marginLeft: "1rem" }}
                      placeholder="Oдобрил..."
                      onChange={this.handleSearch}/>
                  </Form.Group>
                        </div>
                      </div>
                    </div>
                    <TableContainer className="mt-4" component={Paper}>
                    <Table className="table-striped table-hover" aria-label="simple table">
                    <TableHead className="tableHead" style={{backgroundColor:"#B6B9DC"}}>
                          <TableRow>
                              <TableCell width="10%">Поднел</TableCell>
                              <TableCell width="10%">Датум на поднесување</TableCell>
                              <TableCell width="15%">Опис на извештајот</TableCell>
                              <TableCell width="5%">Време</TableCell>
                              <TableCell width="15%">Име на активноста</TableCell>
                              <TableCell width="10%">Опис на активноста</TableCell>
                              <TableCell width="10%">Одобрил</TableCell>
                              <TableCell width="10%">Статус на извештај</TableCell>
                              <TableCell width="15%"></TableCell>
                            </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.reports.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={12} style={{ "text-align": "center" }}>Корисникот нема поднесено извештаи за избраниот датум!</TableCell>
                            </TableRow>
                          )}
                    {(this.state.reports).map((report, index) =>
                            <TableRow key={report.id}>
                              <TableCell>{report.submitterFirstNameLastName}</TableCell>
                              <TableCell>{report.submissionDate
                              ? dateFormat(report.submissionDate, "dd/mm/yyyy")
                              : ""}</TableCell>
                              <TableCell>{report.description}</TableCell>
                              <TableCell>{report.hours + ":" + report.minutes}</TableCell>
                              <TableCell>{report.workingItemName}</TableCell>
                              <TableCell>{report.taskDescription}</TableCell>
                              <TableCell>{report.approverFirstNameLastName ? report.approverFirstNameLastName : ""}</TableCell>
                              {report.isAccepted ? <TableCell>Одобрен</TableCell> : <TableCell>На чекање...</TableCell>}
                              <TableCell></TableCell>
                            </TableRow>
                          )}
                    </TableBody>
                  </Table>
                  <Table>
                    {this.state.reports.length === 0 ? (
                  <div style={{float: "left", fontFamily: "monospace", color: "#0275d8", marginLeft: '1rem'}}>
                    Страница {this.state.currentPage}
                    <br/>
                  </div>
                ) : (
                  <div style={{float: "left", fontFamily: "monospace", color: "#0275d8", marginLeft: '1rem'}}>
                    Страница {this.state.currentPage} од {this.state.totalPages}
                  </div>   
                )}
                </Table>
                <Table>
                {this.state.reports.length > 0 && <Pagination
                  className="my-3"
                  count={this.state.totalPages}
                  page={this.state.currentPage}
                  siblingCount={1}
                  boundaryCount={1}
                  variant="outlined"
                  shape="rounded"
                  onChange={this.handlePageChange}
                  style={{marginLeft: "0.7rem"}}
                />}
                </Table>
              </TableContainer>
              </Fragment>
                )
              } 
              else if (role === "ROLE_EMPLOYEE") {
                return (
                  <Fragment>
                    <NavBar/>
                    <h2 style={{marginTop:"2rem"}}>Извештаи</h2><br/><br/><br/>
                    <div>
                      <div className="row">
                        <div className="col-2" style={{marginLeft:"1rem", marginTop: '1.41rem'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DatePicker
                                      id="startDate"  
                                      name="startDate"
                                      label={"Датум на поднесување"}
                                      value={dateFormat(this.state.reportFilter.startDate, "mm/dd/yyyy")}
                                      onChange={this.handleChangeStartDate}
                                      renderInput={(params) => <TextField {...params} fullWidth sx={{ backgroundColor: 'white' }}
                                      />}/>
                            </LocalizationProvider>
                        </div>
                        <div className="col-2">
                        <Form.Group>
                      <input
                        name="description"
                        id="description"
                        value={this.state.reportFilter.description}
                        type="text"
                        className="form-control"
                        style={{ border: 0, borderBottom: "1px solid gray", marginTop: "2.55rem", marginLeft: "1rem" }}
                        placeholder="Опис на извештај..."
                        onChange={this.handleSearch}

                      />
                    </Form.Group>
                        </div>
                        <div className="col-2">
                        <Form.Group>
                    <input
                      name="approverFirstNameLastName"
                      id="approverFirstNameLastName"
                      value={this.state.reportFilter.approverFirstNameLastName}
                      type="text"
                      className="form-control mb-1"
                      style={{ border: 0, borderBottom: "1px solid gray", marginTop: "2.55rem", marginLeft: "1rem" }}
                      placeholder="Oдобрил..."
                      onChange={this.handleSearch}/>
                  </Form.Group>
                        </div>
                      </div>
                    </div>
                    <TableContainer className="mt-4" component={Paper}>
                    <Table className="table-striped table-hover" aria-label="simple table">
                    <TableHead className="tableHead" style={{backgroundColor:"#B6B9DC"}}>
                          <TableRow>
                              <TableCell width="10%">Поднел</TableCell>
                              <TableCell width="10%">Датум на поднесување</TableCell>
                              <TableCell width="15%">Опис на извештајот</TableCell>
                              <TableCell width="5%">Време</TableCell>
                              <TableCell width="15%">Име на активноста</TableCell>
                              <TableCell width="10%">Опис на активноста</TableCell>
                              <TableCell width="10%">Одобрил</TableCell>
                              <TableCell width="10%">Статус на извештај</TableCell>
                              <TableCell width="15%"></TableCell>
                            </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.reports.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={12} style={{ "text-align": "center" }}>Немате поднесено извештаи за избраниот датум!</TableCell>
                            </TableRow>
                          )}
                    {(this.state.reports).map((report, index) =>
                            <TableRow key={report.id}>
                              <TableCell>{report.submitterFirstNameLastName}</TableCell>
                              <TableCell>{report.submissionDate
                              ? dateFormat(report.submissionDate, "dd/mm/yyyy")
                              : ""}</TableCell>
                              <TableCell>{report.description}</TableCell>
                              <TableCell>{report.hours + ":" + report.minutes}</TableCell>
                              <TableCell>{report.workingItemName}</TableCell>
                              <TableCell>{report.taskDescription}</TableCell>
                              <TableCell>{report.approverFirstNameLastName ? report.approverFirstNameLastName : ""}</TableCell>
                              {report.isAccepted ? <TableCell>Одобрен</TableCell> : <TableCell>На чекање...</TableCell>}
                              <TableCell></TableCell>
                            </TableRow>
                          )}
                    </TableBody>
                    </Table>
                    <Table>
                    {this.state.reports.length === 0 ? (
                  <div style={{float: "left", fontFamily: "monospace", color: "#0275d8", marginLeft: '1rem'}}>
                    Страница {this.state.currentPage}
                    <br/>
                  </div>
                ) : (
                  <div style={{float: "left", fontFamily: "monospace", color: "#0275d8", marginLeft: '1rem'}}>
                    Страница {this.state.currentPage} од {this.state.totalPages}
                  </div>   
                )}
                  </Table>
                  <Table>
                {this.state.reports.length > 0 && <Pagination
                  className="my-3"
                  count={this.state.totalPages}
                  page={this.state.currentPage}
                  siblingCount={1}
                  boundaryCount={1}
                  variant="outlined"
                  shape="rounded"
                  onChange={this.handlePageChange}
                  style={{marginLeft: "0.7rem"}}
                />}
                  </Table>
                </TableContainer>
                </Fragment>
                )
              } else {
                return (
                <Fragment>
                    <NavBar/>
                    <h2 style={{marginTop:"2rem"}}>Извештаи</h2><br/><br/><br/>
                    <div>
                      <div className="row">
                        <div className="col-2" style={{marginLeft:"1rem", marginTop: '1.41rem'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DatePicker
                                      renderDay={(day, _value, DayComponentProps) => {
                                        var isSelected = false;
                                        var date = day.$d;
                                        var dateChanged = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2, '0')}`
                                        const reportsForCheck = this.state.unapprovedReports;
                                        for(var i = 0; i < reportsForCheck.length; i++){
                                          var reportDate = reportsForCheck[i]?.submissionDate.split("T")[0];
                                          if(reportDate === dateChanged) {
                                            isSelected = true;
                                          }
                                        }
                                        if(isSelected){
                                        return (
                                          <Badge
                                            key={day.toString()}
                                            overlap="circular"
                                            color="secondary" variant="dot"
                                          >
                                            <PickersDay {...DayComponentProps} />
                                          </Badge>
                                        );
                                        } 
                                        else if(!isSelected){
                                          return(
                                          <PickersDay {...DayComponentProps} />
                                          )
                                        }
                                      }}
                                      id="startDate"  
                                      name="startDate"
                                      label={"Датум на поднесување"}
                                      value={dateFormat(this.state.reportFilter.startDate, "mm/dd/yyyy")}
                                      onChange={this.handleChangeStartDate}
                                      renderInput={(params) => <TextField {...params} fullWidth sx={{ backgroundColor: 'white' }}
                                      />}/>
                            </LocalizationProvider>
                        </div>
                        <div className="col-2">
                        <Form.Group>
                      <input
                        name="description"
                        id="description"
                        value={this.state.reportFilter.description}
                        type="text"
                        className="form-control"
                        style={{ border: 0, borderBottom: "1px solid gray", marginTop: "2.55rem", marginLeft: "1rem" }}
                        placeholder="Опис на извештај..."
                        onChange={this.handleSearch}

                      />
                    </Form.Group>
                        </div>
                        <div className="col-2">
                    {this.state.approvedByMe && (
                      <Select
                        placeholder={this.state.usersForHead[0]?.person.firstName + " " + this.state.usersForHead[0]?.person.lastName}
                        options={
                          this.state.usersForHead.map((item) => (
                            { value: item.id, label: item.person.firstName + " " + item.person.lastName, name: "submitterFirstNameLastName", isBold: item.isBold }
                          ))}
                        onChange={this.handleSelect}
                        styles={this.styles}
                      />
                    )}
                    {!this.state.approvedByMe && (
                      <Select
                        placeholder={this.state.otherUsers[0]?.person.firstName + " " + this.state.otherUsers[0]?.person.lastName}
                        options={
                          this.state.otherUsers.map((item) => (
                            { value: item.id, label: item.person.firstName + " " + item.person.lastName, name: "submitterFirstNameLastName" }
                          ))}
                        onChange={this.handleSelect}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            boxShadow: "none",
                            border: "none",
                            borderBottom: "1px solid gray",
                            marginTop: "2.5rem",
                            marginLeft: "2rem"
                          })
                        }}
                      />)}
                  </div>
                        <div className="col-2">
                        <Form.Group>
                    <input
                      name="approverFirstNameLastName"
                      id="approverFirstNameLastName"
                      value={this.state.reportFilter.approverFirstNameLastName}
                      type="text"
                      className="form-control mb-1"
                      style={{ border: 0, borderBottom: "1px solid gray", marginTop: "2.55rem", marginLeft: "1rem" }}
                      placeholder="Oдобрил..."
                      onChange={this.handleSearch}/>
                  </Form.Group>
                        </div>
                        <div className="col-2" style={{marginTop: '3rem'}}>
                        <FormControlLabel 
                            control={
                            <Checkbox checked={this.state.checked} name="tasks" id="tasks" value="tasks"
                            onClick={() => 
                              this.setState({ 
                                checked: !this.state.checked, 
                                approvedByMe: !this.state.approvedByMe
                              },
                              () => {
                                if (this.state.checked === false) {
                                  this.getAllApprovedUsersByLoggedHeadUser();
                                }
                                else {
                                  this.findAllUsersWithSameOrganizationalUnitAndNotApprovedByHead();
                                }
                              }
                              )}/>
                            }
                            label="Останати извештаи"/>
                        </div>
                      </div>
                    </div>
                    <TableContainer className="mt-4" component={Paper}>
                    <Table className="table-striped table-hover" aria-label="simple table">
                    <TableHead className="tableHead" style={{backgroundColor:"#B6B9DC"}}>
                          <TableRow>
                              <TableCell width="2%"><input type="checkbox" style={{width: '-webkit-fill-available'}}
                              id="reports" name="reports" value="reports" onClick={() =>
                                this.setState(
                                  {
                                    approveAll: !this.state.approveAll,
                                  }
                                )
                              } onChange={this.handleSelectAll} checked={this.state.approveAll}></input></TableCell>
                              <TableCell width="9%">Поднел</TableCell>
                              <TableCell width="9%">Датум на поднесување</TableCell>
                              <TableCell width="15%">Опис на извештајот</TableCell>
                              <TableCell width="5%">Време</TableCell>
                              <TableCell width="15%">Име на активноста</TableCell>
                              <TableCell width="10%">Опис на активноста</TableCell>
                              <TableCell width="10%">Одобрил</TableCell>
                              <TableCell width="10%">Статус на извештај</TableCell>
                              <TableCell width="15%"><button type="submit" class="btn btn-success" onClick={this.approveReport}><FontAwesomeIcon icon={faCheck}/> 
                              <span className="btn-wrapper--label">Одобри извештаи</span> </button></TableCell>
                            </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.reports.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={12} style={{ "text-align": "center" }}>Корисникот нема поднесено извештаи за избраниот датум!</TableCell>
                            </TableRow>
                          )}
                    {(this.state.reports).map((report, index) =>
                            <TableRow key={report.id}>
                              <TableCell width="2%">{(report.approveByMe === false && role === "ROLE_HEAD_OF_DEPARTMENT") ? "" :
                              report.isAccepted === true ? "" : <ul style={{ listStyleType: "none", marginTop: "1rem", marginLeft: "-1.75rem" }}>
                              <li><input type="checkbox" style={{ cursor: "pointer" }} name={report.id} id={report.id} value={report.id} className="checkbox-reports" onChange={this.handleCheckBox}/></li>
                              </ul>}</TableCell>
                              <TableCell>{report.submitterFirstNameLastName}</TableCell>
                              <TableCell>{report.submissionDate
                              ? dateFormat(report.submissionDate, "dd/mm/yyyy")
                              : ""}</TableCell>
                              <TableCell>{report.description}</TableCell>
                              <TableCell>{report.hours + ":" + report.minutes}</TableCell>
                              <TableCell>{report.workingItemName}</TableCell>
                              <TableCell>{report.taskDescription}</TableCell>
                              <TableCell>{report.approverFirstNameLastName ? report.approverFirstNameLastName : ""}</TableCell>
                              {report.isAccepted ? <TableCell>Одобрен</TableCell> : report.approveByMe ? <TableCell>Неодобрен</TableCell> :
                              <TableCell>На чекање...</TableCell>}
                              <TableCell></TableCell>
                            </TableRow>
                          )}
                    </TableBody>
                    </Table>
                    <Table>
                    {this.state.reports.length === 0 ? (
                  <div style={{float: "left", fontFamily: "monospace", color: "#0275d8", marginLeft: '1rem'}}>
                    Страница {this.state.currentPage}
                    <br/>
                  </div>
                ) : (
                  <div style={{float: "left", fontFamily: "monospace", color: "#0275d8", marginLeft: '1rem'}}>
                    Страница {this.state.currentPage} од {this.state.totalPages}
                  </div>   
                )}
                  </Table>
                  <Table>
                {this.state.reports.length > 0 && <Pagination
                  className="my-3"
                  count={this.state.totalPages}
                  page={this.state.currentPage}
                  siblingCount={1}
                  boundaryCount={1}
                  variant="outlined"
                  shape="rounded"
                  onChange={this.handlePageChange}
                  style={{marginLeft: "0.7rem"}}
                />}
                  </Table>
                </TableContainer>
                <br/>
                {this.state.reports.length > 0 &&
                <span style={{position:'-webkit-sticky'}}>Вкупно поднесено време за избраниот датум: <b>{this.state.hours ? this.state.hours === 1 ? this.state.hours + " час " : this.state.hours + " часа " : ""}</b>
                {this.state.hours && this.state.minutes ? "и ": ""}<b>{this.state.minutes ?  ""  + this.state.minutes + " минути" : ""}</b></span> }
                </Fragment>
                )
              }
            }
        }