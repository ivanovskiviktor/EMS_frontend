import React, { Component } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import WorkingTaskService from "../service/WorkingTaskService";
import {Alert} from "@material-ui/lab";
import {sleep} from "../shared/functions/Sleep";

export default class WorkingTaskEdit extends Component{

    constructor(props){
        super(props)

        this.state = {
            data: {
                id: this.props.task.id,
                name: this.props.task.name,
                label: this.props.task.label
               },
            open: true,
            alert: {'hidden': true, 'message': null, 'type': 'success'}
        }
    }

    handleClose = () => {
        this.setState({
             open: false
         })
     }

    handleChange = e => this.setState({data: {...this.state.data, [e.target.name]: e.target.value}});

     componentDidMount(){
        WorkingTaskService.getWorkingItemById(this.state.data.id).then((res)=>{
           let task = res.data;
           this.setState({
            data: task
        })
         })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let selectedTask = WorkingTaskService.getWorkingItemById(this.state.data.id).then(async (res)=>{
    })
    WorkingTaskService.updateWorkingItem(this.state.data, selectedTask)
    .then(async res=>{
        this.setState({
            data:res.data,
            alert: {'hidden': false, 'message': "Успешно уредена работна задача!", 'type': 'success'},
        })
        await sleep(800);
        this.setState({
            alert: {'hidden': true, 'message': null, 'type': 'success'},
            
        })
        if(this.props.onSave)
        {
            this.props.onSave();
        }
    })
    .catch( async error=>{
        if (error.message === "Request failed with status code 500") {
            this.setState({
                alert: {'hidden': false, 'message': "Неуспешно уредена работна задача!", 'type': 'error'},
            })
            await sleep(4000);
            this.setState({
                alert: {'hidden': true, 'message': null, 'type': 'error'}
            })
    }
    })
   
}


    render() {
        const {data} = this.state;
        return (
                   
                   <Dialog open={this.state.open} onClose={this.handleClose}>
                        <DialogTitle>Уреди работна задача</DialogTitle>
                        <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="name"
                            label="Име на работна задача"
                            type="text"
                            value={data.name}
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
                            type="text"
                            value={data.label}
                            onChange={this.handleChange}
                            fullWidth
                            variant="standard"
                            required
                            />
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={this.handleClose}>Oткажи</Button>
                        <Button type="submit" onClick={this.handleSubmit}>Уреди</Button>
                        </DialogActions>
                        <Alert
                        className="m-3"
                        variant="filled"
                        style={{width: "fit-content"}}
                        severity={this.state.alert.type}
                        hidden={this.state.alert.hidden}>
                        {this.state.alert.message}
                        </Alert>
                        </Dialog>


        )
    }
}