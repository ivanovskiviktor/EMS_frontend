import React, { Fragment } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent } from "@material-ui/core";
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import ReportService from "../service/ReportService";
import Swal from "sweetalert2";
import {sleep} from "../shared/functions/Sleep";
import {Alert} from "@material-ui/lab";

export default class CreateReport extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
          reports: [],
          open: true,
          workingTaskTitle: this.props.title,
          employeeTrackingFormHelper: {
            reportId: this.props.report,
            employeeTrackingFormId: this.props.task,
            description: null,
            hours: 0,
            minutes: 0,
          },
          alert: {'hidden': true, 'message': null, 'type': 'success'}
        };
      }

      async componentDidMount() {
        if (this.state.employeeTrackingFormHelper.reportId !== null) {
          await this.getReport(this.state.employeeTrackingFormHelper.reportId);
        }
      }

      async getReport(id) {
        if (id !== null) {
          await ReportService.getReportById(id).then((res) => {
            if (res.data.hasPreviousReport === true) {
              this.setState({
                employeeTrackingFormHelper: {
                  ...this.state.employeeTrackingFormHelper,
                  employeeTrackingFormId: this.props.task,
                  id: this.props.report,
                  hours: 0,
                  minutes: 0,
                  description: null,
                },
              });
            } else {
              this.setState({
                employeeTrackingFormHelper: {
                  ...this.state.employeeTrackingFormHelper,
                  hours: res.data.hours,
                  id: res.data.id,
                  minutes: res.data.minutes,
                  description: res.data.description,
                },
              });
            }
          });
        }
      }

      async createReport(id) {
        var reportDetails;
        if (this.state.employeeTrackingFormHelper.reportId !== null) {
          reportDetails = {
            id: this.state.employeeTrackingFormHelper.reportId,
            employeeTrackingFormId: id,
            description: this.state.employeeTrackingFormHelper.description,
            hours: this.state.employeeTrackingFormHelper.hours,
            minutes: parseInt(this.state.employeeTrackingFormHelper.minutes)
          };
        } else {
          reportDetails = {
            employeeTrackingFormId: id,
            description: this.state.employeeTrackingFormHelper.description,
            hours: this.state.employeeTrackingFormHelper.hours,
            minutes: parseInt(this.state.employeeTrackingFormHelper.minutes),
          };
        }
        if(this.state.employeeTrackingFormHelper.hours === 0 && this.state.employeeTrackingFormHelper.minutes === 0)
        {
            this.setState({
                alert: {'hidden': false, 'message': "Внесете соодветно часови и минути за извештајот!", 'type': 'error'}
            });
            await sleep(3000);
            this.setState({
                alert: {'hidden': true, 'message': null, 'type': 'error'}
            })
        } else if (this.state.employeeTrackingFormHelper.description === null) {
            this.setState({
                alert: {'hidden': false, 'message': "Внесете соодветно опис за извештајот!", 'type': 'error'}
              });
            await sleep(3000);
              this.setState({
                  alert: {'hidden': true, 'message': null, 'type': 'error'}
              })
        } 
        else {
          await ReportService.createReport(reportDetails)
          .then((res) => {
            this.setState({
                employeeTrackingFormHelper: {
                ...this.state.employeeTrackingFormHelper,
                hours: "0",
              },
            });
            this.handleClose();
            sleep(500);
            Swal.fire({
              icon: "success",
              title: "Успешно!",
              text: "Успешно поднесен извештај. Истиот можете да го погледнете во табот со вашите извештаи!",
            }).then(() => {
              if(this.props.onClose)
                {
                    this.props.onClose();
                }
              }
            );
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Грешка!",
              text: "Неуспешно поднесен извештај!",
            });
          });
        }
      }

      handleChange = (e) => {
        this.setState({
            employeeTrackingFormHelper: {
            ...this.state.employeeTrackingFormHelper,
            [e.target.name]: e.target.value || null,
          },
        });
      };

      handleClose = () => {
        this.setState({
            open: false
        })
    }

    render() {
        return (
            <Dialog open={this.state.open} onClose={this.handleClose}>
            <DialogTitle style={{fontSize: "20px"}}>Поднеси извештај</DialogTitle>
            <DialogContent>
            <Fragment>
            <div className="row">
            <div className="col-12">
            <label for="title" style={{ fontSize: "20px", textAlign: "left", marginRight: "5.9rem"}}>Име на активноста за која се поднесува извештај:</label>
                <input type="text" id="outlined-required" value={this.state.workingTaskTitle} 
                name="title" className="form-control" disabled/>
            </div>
            </div><br/>
            <div className="row">
            <div className="col-12">
            <FormControl>
                <FormLabel style={{fontSize:"20px", fontWeight:"normal"}}>Дневен извештај за активноста:</FormLabel>
                <Textarea placeholder="Внеси забелешка" minRows={1} name="description" id="description" defaultValue={this.state.employeeTrackingFormHelper.description} 
                onChange={this.handleChange}/>
            </FormControl>
            </div>
            </div><br/>
            <div className="row">
                <div className="col-6">
                <label for="hours" style={{ fontSize: "20px", textAlign: "left", marginRight: "3rem"}}>Потрошени часови:</label>
                <select name="hours" id="hours" onChange={this.handleChange} value={this.state.employeeTrackingFormHelper.hours}
                style={{width:'-webkit-fill-available'}}>
                    <option id="0">0</option>
                    <option id="1">1</option>
                    <option id="2">2</option>
                    <option id="3">3</option>
                    <option id="4">4</option>
                    <option id="5">5</option>
                    <option id="6">6</option>
                    <option id="7">7</option>
                    <option id="8">8</option>
                  </select>
                </div>
                <div className="col-6">
                <label for="minutes" style={{ fontSize: "20px", textAlign: "left", marginRight: "3rem"}}>Потрошени минути:</label>
                <select name="minutes" id="minutes" onChange={this.handleChange} value={this.state.employeeTrackingFormHelper.minutes}
                style={{width:'-webkit-fill-available'}}>
                    <option id="0">0</option>
                    <option id="1">15</option>
                    <option id="2">30</option>
                    <option id="3">45</option>
                  </select>
                </div>
            </div><br/><br/>
            <Alert severity={this.state.alert.type} hidden={this.state.alert.hidden}>{this.state.alert.message}</Alert>
            </Fragment>
            </DialogContent>
            <DialogActions>
                <Button color="error" onClick={this.handleClose}>Oткажи</Button>
                <Button type="submit" color="success" onClick={() => this.createReport(this.state.employeeTrackingFormHelper.employeeTrackingFormId)}>Поднеси</Button>
            </DialogActions>
            </Dialog>
        )
    }
}