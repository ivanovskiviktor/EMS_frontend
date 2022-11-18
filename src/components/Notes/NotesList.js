import React, { Component, Fragment } from "react";
import Spinner from "../shared/components/Spinner/Spinner";
import NoteService from "../service/NoteService";
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
  import TableFooter from "@material-ui/core/TableFooter";
  import TablePagination from "@material-ui/core/TablePagination";
  import dateFormat from "dateformat";
  import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default class NotesList extends Component { 

    constructor(props) {
        super(props);
        this.state = {
          notes: [],
          page: 0,
          rowsPerPage: 5,
          totalElements: 0,
          spinner: true,
          open: false
        };
      }

      componentDidMount() {
        this.getNotesPageable(this.state.page, this.state.rowsPerPage)
       } 
     
       async getNotesPageable(page, size) {
        await NoteService.getNotesPageable(page, size)
          .then((response) => response.data)
          .then((data) => {
            this.setState({
              notes: data.content,
              totalElements: data.totalElements
            });
            if(this.state.notes.length > 0) {
                this.setState({
                    spinner: false
                })
            }
            return data.content;
    
          });
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

      handleChangePage = (event, newPage) => {
        this.setState({
          page: newPage,
        })
        this.getNotesPageable(newPage, this.state.rowsPerPage);
      };
    
    handleChangeRowsPerPage = event => {
        this.setState({
          rowsPerPage: (parseInt(event.target.value, 10)),
          page: 0,
        })
        this.getNotesPageable(0, (parseInt(event.target.value, 10)));
      };
      

      render() {
        const {  spinner  } = this.state;
        return (
        <Fragment>
            <NavBar/>
            <br/>
            <h2 style={{marginTop:"2rem"}}>Забелешки</h2>
            <br/><br/><br/>
            {spinner ? (<Spinner smaller="true"/>) :
            <Fragment style={{marginTop:"2rem"}}>
            
              <TableContainer className="mb-4" component={Paper}>
                <Table className="table-striped table-hover" aria-label="simple table">
                  <TableHead className="tableHead" style={{backgroundColor:"#B6B9DC"}}>
                    <TableRow>
                      <TableCell width="35%">Опис</TableCell>
                      <TableCell width="25%">Име и презиме</TableCell>
                      <TableCell width="20%">Почетен датум</TableCell>
                      <TableCell width="20%">Краен датум</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(this.state.notes).map((row, index) =>
                      (
                        <TableRow key={row.id}>
                          <TableCell>{row.description && row.description.length <= 25 ? row.description : 
                          `${row.description.substring(0,25)}`}
                          {row.description.length > 25 && (<a style={{cursor: "cell"}} 
                          onClick={this.handleClickOpen}>...&nbsp;<FontAwesomeIcon icon={faPlus}/></a>)}
                          {row.description.length > 25 && ( 
                            <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title"> {"Целосен опис на забелешката"} </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    {row.description} 
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={this.handleClose}>Затвори</Button>
                            </DialogActions>
                            </Dialog>
                           )}</TableCell>
                          <TableCell>{row.firstName + " " + row.lastName}</TableCell>
                          <TableCell>{row.weekStartDate ? dateFormat(row.weekStartDate, "dd/mm/yyyy")
                          : ""}</TableCell>
                          <TableCell>{row.weekEndDate ? dateFormat(row.weekEndDate, "dd/mm/yyyy")
                          : ""}</TableCell>
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