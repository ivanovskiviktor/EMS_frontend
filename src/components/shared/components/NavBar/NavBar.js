import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "../../../instance/instance.js";
import * as FaIcons from "react-icons/fa"; 
import * as AiIcons from "react-icons/ai";
import {FiUserCheck} from "react-icons/fi";
import { IconContext } from "react-icons";
import { SideBarData } from "./SideBarData";
import { SideBarDataAdmin } from "./SideBarDataAdmin";
import {AiFillFolderOpen} from "react-icons/ai";
import ReportService from "../../../service/ReportService.js";
import './NavBar.css';


export default class NavBar extends Component {

    state = {
        email: "",
        errorMessage: "",
        errorMessageVisible: false,
        sidebar: false,
        notification:null
      };

      showSidebar = () => {
        this.setState({
            sidebar: !this.state.sidebar
          });
      }

      async componentDidMount() {
        const user = await axios
          .get("/rest/user/getUserDetails")
          .catch(function (error) {
          });
        this.notificationReport();
        this.setState({
          email: user.data.email,
          sidebar: this.state.sidebar
        });
      }

       notificationReport() {
         ReportService.getNumberOfNotApprovedReportsForLoggedUser()
            .then((response) => response.data)
            .then((data) => {
                this.setState({
                    notification:data
                });
            });
    }
  

      logOut = () => {
        this.setState({
          email: "",
          sidebar: false
        });
        localStorage.clear();
    
        window.location.href='/'
      };
    
  
    render() {
        var role = localStorage.getItem("ROLES");
    return (
      <>
        <IconContext.Provider value={{ color: "#FFF" }}>
          <div className="navbar">
            <Link to="#" className="menu-bars">
              <FaIcons.FaBars onClick={this.showSidebar} />
            </Link>
            <Link to="#" className="menu-bars">
            </Link>
            <div id="userMail">
            <Link to="#" className="menu-bars1">
            <label  style={{fontSize:'20px', color:"white"}}><FiUserCheck style={{width:"25px", height:"30px", marginTop:'-3px'}}/> {this.state.email}</label>
            </Link>
            {role === "ROLE_HEAD_OF_DEPARTMENT" && 
            <Link to="/reports" className="menu-bars">
            <AiFillFolderOpen/>
              <span className="badge" style={{borderRadius:"50%",backgroundColor:"red",fontSize:"9px",padding:"4px 7px",marginTop:"-20px",marginLeft:"-16px"}}>
                {this.state.notification}
              </span>
            </Link>}
            <Link to="#" className="menu-bars">
            <button type="button" onClick={this.logOut} id="log-out"
            class="btn btn-primary-outline">Одјави се</button>
            </Link>
            </div>
          </div>
          <nav className={this.state.sidebar ? "nav-menu active" : "nav-menu"}>
            <ul className="nav-menu-items" onClick={this.showSidebar}>
              <li className="navbar-toggle">
                <Link to="#" className="menu-bars">
                  <AiIcons.AiOutlineClose />
                </Link>
              </li>
              
              {role==="ROLE_ADMIN" && SideBarDataAdmin.map((item, index) => {
                return (
                  <li key={index} className={item.cName}>
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
              {(role==="ROLE_HEAD_OF_DEPARTMENT" || role==="ROLE_EMPLOYEE") && SideBarData.map((item, index) => {
                return (
                  <li key={index} className={item.cName}>
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </IconContext.Provider>
      </>
    );
            }
            
  }