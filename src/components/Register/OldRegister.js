import React, { Component } from "react";
import {Alert, Button} from 'react-bootstrap';
import UserService from "../service/UserService";
import Container from "react-bootstrap/Container";


import axios from "axios";
import AuthenticationService from "../service/AuthenticationService";



export default class OldRegister extends Component {

    state = {
        //creating the data variable that holds the email and password to be passed on
        data: {
            email: "",
            password: "",
            cnfpassword: "",
        },
        successMessage: "",
        successMessageVisible: false,
        errorMessage: "",
        errorMessageVisible: false,
    };

    handleChange = e => this.setState({
        data: {
            ...this.state.data,
            [e.target.name]: e.target.value
        }
    });

    validate(e) {
        let pass = e;
        let reg = new RegExp (".{8,32}$");
        let test = reg.test(pass);
        if (test) {
            return true;
        } else{
            return false;
        }
    }
    handlesubmit = (e) => {
        e.preventDefault();
        const userHelper = {
            person: {
                firstName: this.state.data.firstname,
                lastName: this.state.data.lastname
            }
        }
        if (!this.validate(this.state.data.password)) {
            this.setState({
                successMessageVisible: false,
                errorMessageVisible: true,
                errorMessage: "Внесете лозинка со минимум 8 карактери!",
            })
      
        }
        else if(this.state.data.cnfpassword !== this.state.data.password) {
            this.setState({
                successMessageVisible: false,
                errorMessageVisible: true,
                errorMessage: "Лозинките не се совпаѓаат!",
            })
        }
        else {
            UserService.registerUser(userHelper, this.state.data.email, this.state.data.password).then(res => {
                this.setState({data: res.data})


                this.setState({
                    errorMessageVisible: false,
                    successMessageVisible: true,
                    successMessage: "Успешна регистрација! Проверете го вашиот мејл за комплетирање на регистрацијата!",
                });

            }).catch(error => {
                if (error.message === "Request failed with status code 500") {
                    this.setState({
                        successMessageVisible: false,
                        errorMessageVisible: true,
                        errorMessage: "Веќе има регистрирано корисник со тој мејл!",
                    })
                }
            })
        }
    }





    render() {
        const {data} = this.state;

        return (
            <div className='Registration overflow-hidden' style={{height:'50rem'}}>
              
            <Container>
                <form className="border border-info rounded shadow-sm p-3 mb-5" onSubmit={this.handlesubmit} style={{display: 'inline-block', width: '50%',marginTop:'10px'}}>
                    <br></br><br></br>
                    <div className="form-group">
                        <br></br>
                        <br></br>
                        <Button href="/sign-in" className="btn btn-md"
                                style={{marginTop:'-90px',color: 'white', background: '#26abd3', border: 'none'}}>Најава </Button>&nbsp;
                        <Button href="/sign-up" className="btn btn-md"
                                style={{marginTop:'-90px',color: 'white', background: '#26abd3', border: 'none'}}>Регистрација</Button>
                    </div>
                    <br></br> <div style={{marginTop:"-45px"}}>
                    <div className="form-group">
                        <input type="text" className="form-control" id="firstName" name="firstname"
                               placeholder="Внеси име"
                               value={data.firstName} onChange={this.handleChange} required/>
                    </div>

                    <div className="form-group" >
                        <input type="text" className="form-control" id="lastName" name="lastname"
                               placeholder="Внеси презимe" value={data.lastName} onChange={this.handleChange} required/>
                    </div>

                    <div className="form-group">
                        <input type="email" className="form-control" id="email" name="email"
                               placeholder="Внеси е-маил адреса" value={data.email} onChange={this.handleChange}
                               required/>
                    </div>

                    <div className="form-group">
                        <input type="password" className="form-control" id="password" name="password"
                               placeholder="Внеси лозинка" value={data.password} onChange={this.handleChange} required/>
                    </div>

                    <div className="form-group">
                        <input type="password" className="form-control" id="cnfpassword" name="cnfpassword"
                               placeholder="Потврди ја лозинката" value={data.cnfpassword} onChange={this.handleChange}
                               required/>
                    </div> </div>
                    <br></br><br></br>
                    <div className="form-group">
                    <Button type="submit" className="btn"
                            style={{color: 'white', background: '#26abd3', width: 'auto', border: 'none',margin:'auto',marginTop:'-30px'}}
                            onSubmit={this.handlesubmit}>Регистрирај се</Button>
                            <br></br><br></br>
{this.state.successMessageVisible && (
                    <Alert
                        style={{
                            marginLeft: "20px",
                        }}
                        variant="success"
                    >
                        {this.state.successMessage}
                    </Alert>
                )}

                {this.state.errorMessageVisible && (
                    <Alert
                        style={{
                            marginTop: "20px",
                        }}
                        variant="danger"
                    >
                        {this.state.errorMessage}
                    </Alert>
                )}
                </div>
                </form>
            </Container>
            </div>
        );
    }
}
