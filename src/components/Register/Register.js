import React, { Component } from "react";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import logo from '../../images/loginPhoto.jpg';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration.js';

export default class OldLogin extends Component {

render() {
    return (
      <section
        class="vh-100"
      >
        <div
          class="container py-5 h-100"
          
        >
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col col-xl-10">
              <div class="card" style={{ borderRadius: "1rem" }}>
                <div class="row g-0">
                  <div class="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src={logo}
                      alt="login form"
                      class="img-fluid"
                      style={{
                        borderRadius: "1rem 0 0 1rem",
                        width: "500px",
                        height: "671.5px",
                      }}
                    />
                  </div>
                  <div class="col-md-6 col-lg-7 d-flex align-items-center">
                    <div class="card-body p-4 p-lg-5 text-black">
                      <form>
                        <div class="d-flex align-items-center mb-3 pb-1">
                          <i
                            class="fas fa-cubes fa-2x me-3"
                            style={{ color: "#ff6219" }}
                          ></i>
                        </div>

                        <h5
                          class="fw-normal mb-3 pb-3"
                          style={{ letterSpacing: "1px" }}
                        >
                          Регистрирајте се на системот
                        </h5>
                        <br />
                        <div class="form-outline mb-4">
                          <TextField
                            required
                            className="form-control form-control-lg"
                            id="outlined-required"
                            label="Име"
                          />
                        </div>
                        <div class="form-outline mb-4">
                          <TextField
                            required
                            className="form-control form-control-lg"
                            id="outlined-required"
                            label="Презиме"
                          />
                        </div>
                        <div class="form-outline mb-4">
                          <TextField
                            required
                            className="form-control form-control-lg"
                            id="outlined-required"
                            label="Е-маил адреса"
                          />
                        </div>
                        <div class="form-outline mb-4">
                          <TextField
                            required
                            className="form-control form-control-lg"
                            id="outlined-required"
                            label="Лозинка"
                            type="password"
                          />
                        </div>
                        <div class="form-outline mb-4">
                          <TextField
                            required
                            className="form-control form-control-lg"
                            id="outlined-required"
                            label="Потврди ја лозинката"
                            type="password"
                          />
                        </div>
                        <div class="pt-1 mb-4">
                          <Button
                            variant="contained"
                            endIcon={<AppRegistrationIcon />}
                          >
                            Регистрирајте се
                          </Button>
                        </div>

                        <br />
                        <br />
                        <p
                          class="mb-5 pb-lg-2"
                          style={{ color: "#393f81" }}
                        >
                          Доколку веќе имате кориснички профил,{" "}
                          <a href="/" style={{ color: "#393f81" }}>
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
    );
}
}
