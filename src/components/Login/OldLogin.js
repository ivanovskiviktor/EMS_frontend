// import React, { Component } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Button } from "react-bootstrap";
// import AuthenticationService from "../service/AuthenticationService.js";
// import { Alert, Spinner } from "react-bootstrap";
// const AUTH_TOKEN = "auth_token";
// // const ROLES = "roles";

// export default class OldLogin extends Component {
//   state = {
//     data: {
//       email: "",
//       password: "",
//     },
//     errorMessage: "",
//     errorMessageVisible: false,
//   };

//   handleChange = (e) =>
//     this.setState({
//       data: { ...this.state.data, [e.target.name]: e.target.value },
//     });

//   handleSubmit = (e) => {
//     e.preventDefault();
//     const { data } = this.state;
//     let data2 = data.email + ":" + data.password;
//     let k = data2.split(":");
//     const request = Buffer.from(data2).toString("base64");
//     AuthenticationService.loginUser(request)
//       .then((res) => {
//         debugger;
//         localStorage.setItem(AUTH_TOKEN, res.data);
//         AuthenticationService.userRole().then((res) => {
//           localStorage.setItem("ROLES", res.data.roles);
//           localStorage.setItem("loggedUserId", res.data.id);
//           this.props.history.push("/homePage")
//         }).finally();
//       })
//       .catch((err) => {
//         if (err.message === "Request failed with status code 403") {
//           this.setState({
//             errorMessageVisible: true,
//             errorMessage: "Вашата е-маил адреса или лозинка се неточни",
//           });
//         }
//       });
//     //alert("Успешна најава!");

//   };

//   render() {
//     const { data } = this.state;
//     let data2 = data.email + ":" + data.password;
//     let k = data2.split(":");
//     return (
//       <div className='LogIn ' >
      
//         <form className=" border border-info rounded shadow-sm p-3 mb-5"
//           onSubmit={this.handleSubmit}
//           style={{ display: "inline-block", width: "30%", marginTop: '10px' }}
//         >
//           <br></br>
//           <br></br>
//           <div className="form-group" style={{ height: '30px' }} >
//             <br></br>
//             <br></br>
//             <Button
//               href="/sign-in"
//               className="btn  btn-md"
//               style={{ color: "white", background: "#26abd3", border: "none", marginTop: '-75px' }}
//             >
//               Најава
//             </Button>
//             &nbsp;
//             <Button
//               href="/sign-up"
//               className="btn  btn-md"
//               style={{ color: "white", background: "#26abd3", border: "none", marginTop: '-75px' }}
//             >
//               Регистрација
//             </Button>
//           </div>
//           <br></br>
//           <div className="form-group">
//             <div>
//               <input
//                 style={{ width: '95%', margin: 'auto' }}
//                 type="email"
//                 className="form-control"
//                 id="email"
//                 name="email"
//                 placeholder="Внесете е-маил адреса"
//                 value={k[0]}
//                 onChange={this.handleChange}
//                 required
//               />
//             </div>
//           </div>
//           <div className="form-group">
//             <input
//               style={{ width: '95%', margin: 'auto' }}
//               type="password"
//               className="form-control"
//               id="password"
//               name="password"
//               placeholder="Внесете лозинка"
//               value={k[1]}
//               onChange={this.handleChange}
//               required
//             />
//           </div>
//           <p
//             className="forgot-password text-right"
//             style={{ textAlign: "center" }}
//           >
//             <a href="#" style={{ color: "#26abd3", marginRight: '10px' }}>
//               Ја заборавивте лозинката?
//             </a>
//           </p>
//           <div>
//             <br></br>
//             <Button
//               type="submit"
//               className="btn"
//               style={{
//                 color: "white",
//                 background: "#26abd3",
//                 width: "auto",
//                 border: "none",
//               }}
//             >
//               Најави се
//             </Button>
//             <br></br>
//             <br></br>
//             {this.state.errorMessageVisible && (
//               <Alert style={{ marginTop: "20px" }} variant="danger">
//                 {this.state.errorMessage}
//               </Alert>
//             )}
//           </div>
//         </form>
//       </div>

//     );
//   }
// }
