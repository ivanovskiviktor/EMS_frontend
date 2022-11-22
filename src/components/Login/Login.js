import React, { Component } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import logo from "../../images/loginPhoto.jpg";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login.js";
import Alert from '@mui/material/Alert';
import "./Login.css";
import AuthenticationService from "../service/AuthenticationService.js";
import { Buffer } from 'buffer';

export default class Login extends Component {
  state = {
    data: {
      email: "",
      password: "",
    },
    errorMessage: "",
    errorMessageVisible: false,
  };

  handleChange = (e) =>
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value },
    });

  handleSubmit = (e) => {
    const { data } = this.state;
    let data2 = data.email + ":" + data.password;
    let k = data2.split(":");
    const request = Buffer.from(data2).toString("base64");
    AuthenticationService.loginUser(request)
      .then((res) => {
        localStorage.setItem("auth_token", res.data);
        AuthenticationService.getUserDetails()
          .then((res) => {
            localStorage.setItem("ROLES", res.data.roles);
            localStorage.setItem("loggedUserId", res.data.id);
            window.location.href = "/dashboard";
          })
          .finally();
      })
      .catch((err) => {
        if (err.message === "Request failed with status code 500") {
          this.setState({
            errorMessageVisible: true,
            errorMessage: "Вашата е-маил адреса или лозинка се неточни",
          });
        }
      });
  };

  render() {
    const { data } = this.state;
    let data2 = data.email + ":" + data.password;
    let k = data2.split(":");
    return (
      <div id="whole">
        <section class="vh-100">
          <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
              <div class="col col-xl-10">
                <div class="card">
                  <div class="row g-0">
                    <div class="col-md-6 col-lg-5 d-none d-md-block">
                      <img src={logo} alt="login form" class="img-fluid" />
                    </div>
                    <div class="col-md-6 col-lg-7 d-flex align-items-center">
                      <div class="card-body p-4 p-lg-5 text-black">
                        <form onSubmit={this.handleSubmit}>
                          <h5 class="fw-normal mb-3 pb-3">
                            Најавете се на системот
                          </h5>
                          <br />
                          <div class="form-outline mb-4">
                            <TextField
                              required
                              className="form-control form-control-lg"
                              id="outlined-required"
                              label="Е-маил адреса"
                              name="email"
                              value={k[0]}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div class="form-outline mb-4">
                            <TextField
                              required
                              className="form-control form-control-lg"
                              id="outlined-required"
                              label="Лозинка"
                              type="password"
                              name="password"
                              value={k[1]}
                              onChange={this.handleChange}
                            />
                          </div>

                          <div class="pt-1 mb-4">
                            <Button
                              variant="contained"
                              endIcon={<LoginIcon />}
                              onClick={() => {
                                this.handleSubmit();
                              }}
                            >
                              Најавете се
                            </Button>
                          </div>
                          {this.state.errorMessageVisible && (
                          <div class="pt-1 mb-4">
                          <Alert severity="error">{this.state.errorMessage}</Alert>
                          </div> )}
                          <br />
                          <br />
                          <p class="paragraph mb-5 pb-lg-2">
                            Доколку се уште се немате регистрирано,{" "}
                            <a href="/register" class="link">
                              регистрирајте се тука!
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
