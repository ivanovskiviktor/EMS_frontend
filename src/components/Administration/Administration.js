import React, { Component, Fragment } from "react";
import NavBar from "../shared/components/NavBar/NavBar";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
  } from "@material-ui/core";
import SearchBar from "../shared/components/SearchBar/SearchBar";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Spinner from "../shared/components/Spinner/Spinner";
import UserService from "../service/UserService";
import AuthenticationService from "../service/AuthenticationService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleInfo, faMinusCircle, faPerson, faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";


export default class Administration extends Component{

    constructor(props) {
        super(props);
        this.state = {
          userFilter: { 
            firstName: null,
            lastName: null,
            email: null
          },
          successMessage: "",
          successMessageVisible: false,
          errorMessage: "",
          errorMessageVisible: false,
          users: [],
          departments: [],
          enabled: "",
          loggedUserEmail : "",
          page: 0,
          rowsPerPage: 5,
          totalElements: 0,
          spinner: true
        };
        this.handleChangePage = this.handleChangePage.bind(this);
        this.getUsersDepartments = this.getUsersDepartments.bind(this);
      }

      async getLoggedHeadDetails() {
        await AuthenticationService.getUserDetails()
        .then((response) => response.data)
        .then((data) => {
            this.setState({
                loggedUserEmail: data.email
            })
        })
      }

      async componentDidMount() {
        await this.getLoggedHeadDetails();
        await this.getUsersByPagination({}, this.state.page, this.state.rowsPerPage);
      }
    

      async getUsersByPagination(userFilter, page,size) {
        await UserService.getAllUsersPageable(page, size, userFilter)
          .then((response) => response.data)
          .then((data) => {
            this.setState({
              users: data.content,
              totalElements: data.totalElements,
              spinner: false
            });
            this.getUsersDepartments(this.state.users);
            return data.content;
          });
      }

      handleChangePage = (event, newPage) => {
        this.setState({
          page: newPage,
        })
        this.getUsersByPagination(this.state.userFilter, newPage, this.state.rowsPerPage);
      };
    
      handleChangeRowsPerPage = event => {
        this.setState({
          rowsPerPage: (parseInt(event.target.value, 10)),
          page: 0,
        })
        this.getUsersByPagination(this.state.userFilter, 0, (parseInt(event.target.value, 10)));
      };

      enableUser(id) {
        UserService.enableUser(id)
          .then(() => {
            this.setState({
              users: this.state.users.map((user) => {
                if (id === user.id) {
                  return { ...user, enabled: !user.enabled };
                }
                return user;
              }),
            });
          });
      }
      
      disableUser(id) {
        UserService.disableUser(id).then(() => {
          this.setState({
            users: this.state.users.map((user) => {
              if (id === user.id) {
                return { ...user, enabled: !user.enabled };
              }
              return user;
            }),
          });
        });
      }

      setLoggedUserAsHead(id) {
        UserService.setLoggedUserAsHead(id).then(() => {
          this.setState({
            users: this.state.users.map((user) => {
              if (id === user.id) {
                return { ...user, isHead: !user.isHead };
              }
              return user;
            }),
          });
        });
      }
    
      setLoggedUserAsEmployee(id) {
        UserService.setLoggedUserAsEmployee(id).then(() => {
          this.setState({
            users: this.state.users.map((user) => {
              if (id === user.id) {
                return { ...user, isHead: !user.isHead };
              }
              return user;
            }),
          });
        });
      }
    
      getUsersDepartments(users) {
        let allUsers = users.map((user) => {
          let departments = [];
          UserService.getUsersDepartments(user.id)
            .then((response) => response.data)
            .then((data) => {
              let departments = data.map((department) => department.name);
              user.departments = departments;
              this.setState({
                users: this.state.users.map((user2) => {
                  if (user.id === user2.id) {
                    return { ...user2, departments: departments };
                  }
                  return user2;
                }),
              });
            });
          user.departments = departments;
          return user;
        });
      }

      handleSearch = (id, value) => {
     
        let newFilter = {
            ...this.state.userFilter,
        }
        newFilter[id] = value;

        this.getUsersByPagination(newFilter, 0, this.state.rowsPerPage)
        
        this.setState({
            page: 0,
            userFilter: newFilter
        })

    }
    
    render() {
        const {  spinner, loggedUserEmail } = this.state;

        console.log(loggedUserEmail);
        return (
            <Fragment>
            <NavBar/>
            <br/>
            <h2 style={{marginTop:"2rem"}}>Администрација</h2>
            <br/><br/><br/>
            {spinner ? (<Spinner smaller="true"/>) :
            <Fragment style={{marginTop:"2rem"}}>
            
              <TableContainer className="mb-4" component={Paper}>
                <Table className="table-striped table-hover" aria-label="simple table">
                  <TableHead className="tableHead" style={{backgroundColor:"#B6B9DC"}}>
                    <TableRow>
                      <TableCell width="2%">#</TableCell>
                      <TableCell width="12.25%">Одобри корисник</TableCell>
                      <TableCell width="12.25%">Име</TableCell>
                      <TableCell width="12.25%">Презиме</TableCell>
                      <TableCell width="12.25%">Е-маил адреса</TableCell>
                      <TableCell width="12.25%">Улога</TableCell>
                      <TableCell width="12.25%">Преглед на раководител</TableCell>
                      <TableCell width="12.25%">Преглед на oддели</TableCell>
                    </TableRow>
                    <TableRow style={{backgroundColor:"#B6B9DC"}}>
                      <TableCell width="2%"></TableCell>
                      <TableCell width="12.25%"></TableCell>
                      <TableCell width="12.25%">
                      <SearchBar handleSearch={this.handleSearch} id="firstName"/></TableCell>
                      <TableCell width="12.25%">
                      <SearchBar handleSearch={this.handleSearch} id="lastName"/></TableCell>
                      <TableCell width="12.25%">
                      <SearchBar handleSearch={this.handleSearch} id="email"/></TableCell>
                      <TableCell width="12.25%"></TableCell>
                      <TableCell width="12.25%"></TableCell>
                      <TableCell width="12.25%"></TableCell>     
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {(this.state.users).filter(item => item.email !== loggedUserEmail).map((user, index) =>
                  (
                    <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.enabled && (
                        <button type="button" class="btn btn-success" onClick={() => this.disableUser(user.id)}>
                            <FontAwesomeIcon icon={faPlusCircle}/></button>
                    )}
                    {!user.enabled && (
                        <button type="button" class="btn btn-danger" onClick={() => this.enableUser(user.id)}><FontAwesomeIcon icon={faMinusCircle}/></button>
                    )}
                    </TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.isHead &&  (
                        <button type="button" class="btn btn-info" onClick={() => this.setLoggedUserAsEmployee(user.id)}>
                        <FontAwesomeIcon icon={faPerson}/><span className="btn-wrapper--label">Раководител</span></button>)}
                        {!user.isHead && (
                        <button type="button" class="btn btn-info" onClick={() => this.setLoggedUserAsHead(user.id)}>
                        <FontAwesomeIcon icon={faPerson}/><span className="btn-wrapper--label">Вработен</span></button>)}
                        </TableCell>
                    <TableCell>
                      <Link to={"/UsersHead/" + user.id}>
                        {/* {user.isHead && ( 
                        <button className="btn btn-warning" disabled="true">  
                          <FontAwesomeIcon icon={faCircleInfo}/><span className="btn-wrapper--label">Преглед на раководител</span></button>)} */}
                        <button className="btn btn-warning">  
                          <FontAwesomeIcon icon={faCircleInfo}/><span className="btn-wrapper--label">Преглед на раководител</span></button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link to={"/UsersDepartments/" + user.id}>
                        <button className="btn btn-warning">
                          <FontAwesomeIcon icon={faCircleInfo}/><span className="btn-wrapper--label">Преглед на оддели</span></button>
                      </Link>
                    </TableCell>
                    </TableRow>
                  )
                  )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        colSpan={12}
                        count={this.state.totalElements-1}
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
}
      </Fragment>
        )
    }

}