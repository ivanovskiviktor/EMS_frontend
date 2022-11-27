import React from "react";
import EmployeeTrackingFormService from "../service/EmployeeTrackingFormService";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Swal from "sweetalert2";
import {sleep} from "../shared/functions/Sleep";


export default class CloseTask extends React.Component { 

    constructor(props){
        super(props);

        this.state={
            task: this.props.task,
            open: true
        }
    }

    handleClose = () => {
        this.setState({
            open: false
        })
    }

    async closeTask(taskId) {
        debugger;
        await EmployeeTrackingFormService.closeTask(taskId)
            .then((res) => {
            this.handleClose();
            this.props.onCloseTask();
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

    render () {
        return (
            <Dialog open={this.state.open} onClose={this.handleClose}>
                        <DialogTitle>Дали сте сигурни дека сакате да ја затворите тековната задача?</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                          Со затворање на тековната задача, нејзиниот краен датум ќе се постави на денешниот.
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button color="error" onClick={this.handleClose}>Oткажи</Button>
                        <Button color="success" type="button" onClick={() => this.closeTask(this.state.task.id)}>Затвори задача</Button>
                        </DialogActions>
                        </Dialog>
        )
    }
}