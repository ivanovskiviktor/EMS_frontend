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


export default class UpdateClosedTask extends React.Component { 

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

    async updateClosedTask(id) {
        await EmployeeTrackingFormService.updateClosedTask(id)
            .then((res) => {
              this.handleClose();
              this.props.onUpdateTask();
              sleep(500);
              Swal.fire({
                icon: "success",
                title: "Успешно!",
                text: "Успешно повторно отворена задача. Статусот е поставен во изработка!",
              });
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Грешка!",
                text: "Неуспешно менување на статус!",
              });
            });
      }

    render () {
        return (
            <Dialog open={this.state.open} onClose={this.handleClose}>
                <DialogTitle>Дали сте сигурни дека повторно сакате да ја отворите избраната задача?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Доколку повторно ја отворите селектираната задача, статусот на задачата ќе се промени во изработка, а почетниот датум ќе
                    биде поставен на денешниот. Дали сте сигурни дека сакате повторно да ја отворите задачата?
                    </DialogContentText>
                </DialogContent> 
                <DialogActions>
                <Button color="error" onClick={this.handleClose}>Затвори</Button>
                <Button color="success" type="button" onClick={() => this.updateClosedTask(this.state.task.id)}>Отвори задача</Button>
                </DialogActions>
            </Dialog>
        )
    }
}