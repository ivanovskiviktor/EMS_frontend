import React from "react";
import ReportService from "../service/ReportService";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent } from "@material-ui/core";
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export default class EmployeeTrackingFormPreview extends React.Component { 

    constructor(props){
        super(props);

        this.state={
            employeeTrackingFormHelper: {
                reportId: this.props.task.reportId,
                employeeTrackingFormId: this.props.task,
                description: null,
                hours: null,
                minutes: 0
            },
            open: true
        }
    }

    async componentDidMount(){
        if (this.state.employeeTrackingFormHelper.reportId !== null) {
            await this.getReport(this.state.employeeTrackingFormHelper.reportId);
        }
    }
    async getReport(id) {
        if (id !== null) {
            await ReportService.getReportById(id).then((res) => {
                this.setState({
                    employeeTrackingFormHelper: {
                        ...this.state.employeeTrackingFormHelper,
                        hours: res.data.hours,
                        id: res.data.id,
                        minutes: res.data.minutes,
                        description: res.data.description
                    }
                });
            });
        }
    }

    handleClose = () => {
        this.setState({
            open: false
        })
    }

    render() {
        return (
            <Dialog open={this.state.open} onClose={this.handleClose}>
            <DialogTitle style={{fontSize: "20px"}}>Преглед на поднесената активност и извештај</DialogTitle>
            <DialogContent>
           
            <label style={{marginLeft:'1.25rem',fontWeight:'bold'}}>Работна задача:  </label> {this.props.task.workingItemName}<br/><br/>

            <label style={{marginLeft:'1.25rem',fontWeight:'bold'}}>Организациона единица: </label> {this.props.task.organizationalDepCode}<br/><br/>
            
            <label style={{marginLeft:'1.25rem',fontWeight:'bold'}}>Статус на задача:  </label> {this.props.task.statusName}<br/><br/>
            
            <label style={{marginLeft:'1.25rem',fontWeight:'bold'}}>Вредност:  </label> {this.props.task.value}<br/><br/>
           
            <label style={{marginLeft:'1.25rem',fontWeight:'bold'}}>Име на вработен: </label>  {this.props.task.creatorName}<br/><br/>
            
            <label style={{marginLeft:'1.25rem',fontWeight:'bold'}}>Презиме на вработен:  </label> {this.props.task.creatorSurname}<br/><br/>
            
            <label style={{marginLeft:'1.25rem',fontWeight:'bold'}}>Опис на задача:  </label> {this.props.task.employeeTrackingFormDescription}<br/><br/><br/>
        
            <label style={{fontWeight:'bold', marginLeft:'1.25rem',fontSize:"14pt"}}>Податоци за извештај: </label><br/><br/>

            <label style={{marginLeft:'1.25rem',fontWeight:'bold'}}>Опис на извештај: </label> {this.state.employeeTrackingFormHelper.description}<br/><br/>
            
            <label style={{marginLeft:'1.25rem',fontWeight:'bold'}}>Изработени часови: </label> {this.state.employeeTrackingFormHelper.hours}<br/><br/>
           
            <label style={{marginLeft:'1.25rem',fontWeight:'bold'}}>Изработени минути: </label> {this.state.employeeTrackingFormHelper.minutes}<br/><br/><br/>
            </DialogContent>
            <DialogActions>
            <Button autoFocus onClick={this.handleClose}>Затвори</Button>
        </DialogActions>
            </Dialog>
        )
    }

}