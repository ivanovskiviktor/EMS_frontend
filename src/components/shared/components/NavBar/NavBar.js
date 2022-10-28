import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "../../../instance/instance.js";
import * as FaIcons from "react-icons/fa"; 
import * as AiIcons from "react-icons/ai";
import { IconContext } from "react-icons";
import { SideBarData } from "./SideBarData";


import './NavBar.css';


export default class NavBar extends Component {

    state = {
        email: "",
        errorMessage: "",
        errorMessageVisible: false,
        sidebar: false
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
        this.setState({
          email: user.data.email,
          sidebar: this.state.sidebar
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
            <img src={require('../../../../images/application-logo.png')} style={{width:'50px', marginTop:'10px'}} />
            </Link>
            <Link to="#" className="menu-bars">
            <label style={{fontSize:'20px',marginLeft:'1200px', color:"white"}}>Логирани сте како: {this.state.email}</label>
            </Link>
            <Link to="#" className="menu-bars">
            <button type="button" onClick={this.logOut} 
            class="btn btn-primary-outline" style={{backgroundColor:"transparent", borderColor:"#ccc", color:"white"}}>Одјави се</button>
            </Link>
          </div>
          <nav className={this.state.sidebar ? "nav-menu active" : "nav-menu"}>
            <ul className="nav-menu-items" onClick={this.showSidebar}>
              <li className="navbar-toggle">
                <Link to="#" className="menu-bars">
                  <AiIcons.AiOutlineClose />
                </Link>
              </li>
              {SideBarData.map((item, index) => {
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