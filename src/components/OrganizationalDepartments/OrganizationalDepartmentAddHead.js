import React, { Component, Fragment } from "react";
import OrganizationalDepartmentService from "../service/OrganizationalDepartmentService";
import UserService from "../service/UserService";
import Swal from "sweetalert2";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPersonCircleCheck, faSave, faTasks} from "@fortawesome/free-solid-svg-icons";

export default class OrganizationalDepartmentAddHead extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          allHeadUsers: [],
          OrganizationalDepartmentAddHead: {
            users: [],
            orgId: null
          },
          filteredItems: []
        };
      }

      async componentDidMount() {
        await this.getAllHeads();
      }
      
      async getAllHeads() {     
        await UserService.getHeadUsers().then((response) => {
          this.setState({
            allHeadUsers: response.data,
            filteredItems: response.data
          });      
          let arr = document.getElementsByClassName("check_boxheadusers")
        Array.prototype.forEach.call(arr, function(el) {
            el.checked=false;
            el.disabled=false;
        });
          response.data.forEach(elem => {
            if(document.getElementById(elem.id)!==null){
              document.getElementById(elem.id).checked="true"; 
              document.getElementById(elem.id).disabled="true";
            }
        });
        })
      }

      filter = (e) => {
        const value = e.target.value;
        if (value === null || value === "") {
          this.setState({
            filteredItems: this.state.allHeadUsers,
          });
        } else {
          let list = [];
          this.state.allHeadUsers.map((head) => {
            if (head.email !== null) {
              if (
                head.email.toLocaleString().toLowerCase().includes(value.toLowerCase())
              ) {
                list.push(head);
              }
            }
          });
          if (list.length > 0) {
            this.setState({
              filteredItems: list,
            });
          } else {
            this.setState({
              filteredItems: [],
            });
          }
        }
      };
    
      handleChangeDepartmentsHead = (e) => {
        let arr = document.getElementsByClassName("check_boxheadusers")
        let arr2 = []
        Array.prototype.forEach.call(arr, function(el) {
            if(el.checked===true){
                arr2.push(parseInt(el.id))
            }
        });
        this.setState({
            OrganizationalDepartmentAddHead: {
                ...this.state.OrganizationalDepartmentAddHead,
                users: arr2,
                orgId: this.props.organizationalDepartmentId
            },
        });
    }
    
    handleSubmit = (e) => {
          e.preventDefault();
          OrganizationalDepartmentService.setHeadUsers(this.state.OrganizationalDepartmentAddHead).then(()=>{
              Swal.fire({
                icon: 'success',
                title: 'Успешно!',
                text:  'Промените се успешно зачувани!',
                })
          }).catch(error => {
              Swal.fire({
                  icon: 'error',
                  title: 'Грешка!',
                  text: 'Обидете се повторно!',
              })
          })
    }
        

    render() {
        return (
            <Fragment>
            <br/><br/><br/>
            <p style={{ fontFamily: "sans-serif", color: "#A9A9A9", fontSize: "1.5rem", fontWeight: "bold", display: "flex",
            marginLeft: "15px", marginTop: "20px", marginLeft: "20.75rem" }}>
            Раководители:{" "}</p>{" "}<br/>
            <ul style={{ listStyleType: "none", display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
                justifyItems: "baseline", marginLeft: "18.75rem"}}>
                {this.state.filteredItems.length === "" &&
                    this.state.filteredItems.length === 1 ? (<div />) : 
                    (this.state.filteredItems.map((item) => (
              <         div style={{textAlign:"left", marginRight:"20px"}}>
                        <li>
                  <label>
                    <input type="checkbox" name={item.email} id={item.id} className="check_boxheadusers" 
                    onChange={(e) => this.handleChangeDepartmentsHead(e)}/>&nbsp; {item.email}
                  </label>
                </li>
              </div>)))}
            </ul> <br/><br/>
            <button type="button" class="btn btn-success" onClick={(e) => this.handleSubmit(e)} style={{marginLeft: "30.1rem"}}><FontAwesomeIcon icon={faSave}/>
                <span className="btn-wrapper--label">Зачувај промени</span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Fragment>
        )
    }
}