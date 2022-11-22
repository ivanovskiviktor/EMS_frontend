import React, { Component } from "react";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import logo from '../../images/loginPhoto.jpg';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration.js';
import UserService from "../service/UserService";
import {sleep} from "../../components/shared/functions/Sleep.js";
import './Register.css';


export default class Register extends Component {

      state = {
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
            UserService.registerUser(userHelper, this.state.data.email, this.state.data.password).then(async res => {
              
                this.setState({
                    data: res.data,
                    errorMessageVisible: false,
                    successMessageVisible: true,
                    successMessage: "Успешна регистрација!",
                    data: {
                      ...this.state.data,
                      firstName: "",
                      lastName: "",
                      email: "",
                      password: "",
                      cnfpassword: ""
                    }
                });
                await sleep(1000);
                this.setState({
                  successMessageVisible: false
                })
                window.location.href = "http://localhost:3000/"
            }).catch(error => {
                if (error.message === "Request failed with status code 500") {
                    this.setState({
                        successMessageVisible: false,
                        errorMessageVisible: true,
                        errorMessage: "Веќе има регистрирано корисник со тој мејл!"
                    })
                }
            })
        }
    }
    

render() {
    const {data} = this.state;
    return (
      <div id="whole">
      <section
        class="vh-100"
      >
        <div
          class="container py-5 h-100"
          
        >
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col col-xl-10">
              <div class="card">
                <div class="row g-0">
                  <div class="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src={logo}
                      alt="login form"
                      class="img-fluid"
                    />
                  </div>
                  <div class="col-md-6 col-lg-7 d-flex align-items-center">
                    <div class="card-body p-4 p-lg-5 text-black">
                      <form onSubmit={this.handlesubmit}>
                        <h5
                          class="fw-normal mb-3 pb-3"
                        >
                          Регистрирајте се на системот
                        </h5>
                        <br />
                        <div class="form-outline mb-4">
                          <TextField
                            required
                            className="form-control form-control-lg"
                            id="outlined-required"
                            name="firstname"
                            onChange={this.handleChange}
                            value={data.firstName}
                            label="Име"
                          />
                        </div>
                        <div class="form-outline mb-4">
                          <TextField
                            required
                            className="form-control form-control-lg"
                            id="outlined-required"
                            name="lastname"
                            onChange={this.handleChange}
                            value={data.lastName}
                            label="Презиме"
                          />
                        </div>
                        <div class="form-outline mb-4">
                          <TextField
                            required
                            className="form-control form-control-lg"
                            id="outlined-required"
                            name="email"
                            onChange={this.handleChange}
                            value={data.email}
                            label="Е-маил адреса"
                          />
                        </div>
                        <div class="form-outline mb-4">
                          <TextField
                            required
                            className="form-control form-control-lg"
                            id="outlined-required"
                            name="password"
                            onChange={this.handleChange}
                            value={data.password}
                            label="Лозинка"
                            type="password"
                          />
                        </div>
                        <div class="form-outline mb-4">
                          <TextField
                            required
                            className="form-control form-control-lg"
                            id="outlined-required"
                            name="cnfpassword"
                            onChange={this.handleChange}
                            value={data.cnfpassword}
                            label="Потврди ја лозинката"
                            type="password"
                          />
                        </div>
                        <div class="pt-1 mb-4">
                          <Button
                            variant="contained"
                            endIcon={<AppRegistrationIcon />}
                            onClick={() => {
                              this.handlesubmit()
                            }}
                          >
                            Регистрирајте се
                          </Button>
                        </div>
                        {this.state.errorMessageVisible && (
                        <div class="pt-1 mb-4">
                        <Alert severity="error">{this.state.errorMessage}</Alert>
                        </div> )}
                        {this.state.successMessageVisible && (
                        <div class="pt-1 mb-4">
                        <Alert severity="success">{this.state.successMessage}</Alert>
                        </div> )}
                        <br />
                        <br />
                        <p
                          class="paragraph mb-5 pb-lg-2"
                        >
                          Доколку веќе имате кориснички профил,{" "}
                          <a href="/" class="link">
                            најавете се!
                          </a>
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    );
}
}