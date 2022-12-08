import React, { Component, Fragment } from "react";
import NavBar from "../shared/components/NavBar/NavBar";
import Button from '@mui/material/Button';
import WorkingTaskService from '../service/WorkingTaskService';
import WorkingTaskEdit from "./WorkingTaskEdit";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
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
  import {sleep} from "../shared/functions/Sleep";
  import DeleteDialog from "../shared/components/Dialogs/DeleteDialog";
  import {Alert} from "@material-ui/lab";
  import Spinner from "../shared/components/Spinner/Spinner";
  import { confirmAlert } from 'react-confirm-alert';
  import 'react-confirm-alert/src/react-confirm-alert.css'; 
  import '../shared/css/row-stripping.css';






export default class WorkingTasksList extends Component{

    constructor(props){
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            data: {
            name: "",
            label: ""
            },
            tasks: [],
            page: 0,
            rowsPerPage: 5,
            totalElements: 0,
            open: false,
            spinner: true,
            alert: {'hidden': true, 'message': null, 'type': 'success'}
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
            WorkingTaskService.addWorkingItem(this.state.data).then(async () =>{
                this.setState({
                    alert: {'hidden': false, 'message': "Успешно додаденa работна задача!", 'type': 'success'},
                    open:false,
                    data: {
                        name: "",
                        label: ""
                    }
                })
                this.getWorkingTasksPageable(0,this.state.rowsPerPage);
                await sleep(4000);
                this.setState({
                    alert: {'hidden': true, 'message': null, 'type': 'success'},
                    
                })
             })
             .catch(async error =>{ 
                if (error.message === "Request failed with status code 500") {
                    this.setState({
                        alert: {'hidden': false, 'message': "Неуспешно додаденa работна задача!", 'type': 'error'},
                    })
                    await sleep(4000);
                    this.setState({
                        alert: {'hidden': true, 'message': null, 'type': 'error'}
                    })
            }
             })
          };
    
    handleDelete = id => {
        WorkingTaskService.deleteWorkingItem(id).then(async () => {
                this.setState({
                    alert: {'hidden': false, 'message': "Успешно избришана работна задача!", 'type': 'success'},
                })
                this.getWorkingTasksPageable(0,this.state.rowsPerPage);
                await sleep(4000);
                this.setState({
                    alert: {'hidden': true, 'message': null, 'type': 'success'},
                    
                })
            }).catch(async error =>{ 
                if (error.message === "Request failed with status code 500") {
                    this.setState({
                        alert: {'hidden': false, 'message': "Неуспешно избришана работна задача!", 'type': 'error'},
                    })
                    await sleep(4000);
                    this.setState({
                        alert: {'hidden': true, 'message': null, 'type': 'error'}
                    })
            }
             })
          };
          
    

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


    handleChange = e => this.setState({data: {...this.state.data, [e.target.name]: e.target.value}});
    
    handleChangePage = (event, newPage) => {
        this.setState({
          page: newPage,
        })
        this.getWorkingTasksPageable(newPage, this.state.rowsPerPage);
      };
    
    handleChangeRowsPerPage = event => {
        this.setState({
          rowsPerPage: (parseInt(event.target.value, 10)),
          page: 0,
        })
        this.getWorkingTasksPageable(0, (parseInt(event.target.value, 10)));
      };
      
      
    componentDidMount() {
        this.getWorkingTasksPageable(this.state.page, this.state.rowsPerPage);  
      }
    

    getWorkingTasksPageable(page,size) {
        WorkingTaskService.getWorkingItemsPageable(page, size)
            .then(response => response.data).then((data) => {
                this.setState({
                    tasks: data.content,
                    totalElements: data.totalElements,
                    spinner: false
                });
            });
    }



render() {
    const {  spinner  } = this.state;
    return (
        <Fragment>
            <NavBar/>
            <h2 style={{marginTop:"2rem"}}>Работни задачи</h2>
            <br/><br/><br/>
            <Alert
              className="m-3"
              variant="filled"
              style={{width: "fit-content"}}
              severity={this.state.alert.type}
              hidden={this.state.alert.hidden}>
              {this.state.alert.message}
          </Alert>
            {spinner ? (<Spinner smaller="true"/>) :
            <Fragment style={{marginTop:"2rem"}}>
            
              <TableContainer className="mb-4" component={Paper}>
                <Table className="table-striped table-hover" aria-label="simple table">
                  <TableHead className="tableHead" style={{backgroundColor:"#B6B9DC"}}>
                    <TableRow>
                      <TableCell width="18%">#</TableCell>
                      <TableCell width="27%">Име</TableCell>
                      <TableCell width="27%">Лабела</TableCell>
                      <TableCell width="30%" align="right">
                        <button type="button" class="btn btn-success" onClick={this.handleClickOpen}><FontAwesomeIcon icon={faPlusCircle}/> <span className="btn-wrapper--label">Додади работна задача</span> </button>
                        <Dialog open={this.state.open} onClose={this.handleClose}>
                        <DialogTitle>Додади работна задача</DialogTitle>
                        <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="name"
                            label="Име на работна задача"
                            value={this.state.data.name}
                            type="text"
                            onChange={this.handleChange}
                            fullWidth
                            variant="standard"
                            required
                            />
                            <TextField
                            autoFocus
                            margin="dense"
                            id="label"
                            name="label"
                            label="Лабела на работна задача"
                            value={this.state.data.label}
                            type="text"
                            onChange={this.handleChange}
                            fullWidth
                            variant="standard"
                            required
                            />
                        </DialogContent>
                        <DialogActions>
                        <Button color="error" onClick={this.handleClose}>Oткажи</Button>
                        <Button type="submit" color="success" onClick={this.handleSubmit}>Додади</Button>
                        </DialogActions>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(this.state.tasks).map((row, index) =>
                      (
                        <TableRow key={row.id}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.label}</TableCell>
                          <TableCell><button type="button" onClick={е=>confirmAlert({
                          customUI: ({ onClose }) => {
                return (
                    

                <WorkingTaskEdit tasks={this.state.tasks} task={row} onSave={() => {
                                     this.getWorkingTasksPageable(this.state.page,this.state.rowsPerPage); 
                                     onClose();
                                }} />
                              
                       );
   },
   closeOnEscape: true,
   closeOnClickOutside: false,
   willUnmount: () => {},
   afterClose: () => {},
   onClickOutside: () => {},
   onKeypressEscape: () => {}})}
 class="btn btn-warning"><FontAwesomeIcon icon={faEdit}/> <span className="btn-wrapper--label">Уреди</span></button>&nbsp;&nbsp;&nbsp;
                          <DeleteDialog handleDelete={() => this.handleDelete(row.id)}/>
                          </TableCell>
                        </TableRow>)
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        colSpan={12}
                        count={this.state.totalElements}
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