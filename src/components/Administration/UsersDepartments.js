import React, { Component, Fragment } from "react";
import OrganizationalDepartmentService from "../service/OrganizationalDepartmentService";
import NavBar from "../shared/components/NavBar/NavBar";
import Container from "react-bootstrap/Container";
import Checkbox from "rc-checkbox";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle, faTrash} from "@fortawesome/free-solid-svg-icons";

export default class UsersDepartments extends Component{

    constructor(props) {
        super(props);
        this.state = {
          users: [],
          id: this.props.match.params.id,
          organizationalDepartmentIds: [], 
          departments: [],
          userDepartments: [],
          completed: false,
          organizationalDepartmentIdstoDelete: []
        };
      }

      async componentDidMount() {
        await this.getDepartments();
        await this.getUsersDepartments(this.state.id);
      }

      getDepartments() {
        OrganizationalDepartmentService.getDepartmentsNotPageable()
          .then((response) => response.data)
          .then((data) => {
            this.setState({
                departments: data
            });
          });
      }

      getUsersDepartments(userId) {
        OrganizationalDepartmentService.getDepartmentsForUser(userId)
          .then((response) => response.data)
          .then((data) => {
            this.setState({
                userDepartments: data
            });
          });
      }
  
      addDepartmentsToUser(){
        const organizationalDepartmentIdHelper = {
          userId:this.state.id,
          organizationalDepartmentIds:this.state.organizationalDepartmentIds
        }   
        
        OrganizationalDepartmentService.addOrganizationalDepartmentToUser(organizationalDepartmentIdHelper)
        .then((response) => response.data)
        .then((data) => {
          this.setState({
            organizationalDepartmentIds: data.content
          });
        });
        }

        deleteDepartmentsFromUser(){
            const organizationalDepartmentIdHelper={
              userId:this.state.id,
              organizationalDepartmentIds:this.state.organizationalDepartmentIdstoDelete,
            }
            
            OrganizationalDepartmentService.deleteOrganizationalDepartmentFromUser(organizationalDepartmentIdHelper)
                .then((response) => response.data)
                .then((data) => {
                  this.setState({
                    organizationalDepartmentIdstoDelete: data.content
                  });
                });
          }
    
          
    handleCheckBox = (e) =>
      {
        if (e.target.checked) {
          if (!this.state.organizationalDepartmentIds.includes(e.target.value)) {
            this.setState(prevState => ({ organizationalDepartmentIds: [...prevState.organizationalDepartmentIds, e.target.value]}))
          }
        } else {
          this.setState(prevState => ({ organizationalDepartmentIds: prevState.organizationalDepartmentIds.filter(item => item !== e.target.value) }));
        }
      }

    handleCheckBoxDelete = (e) => {
      if (e.target.checked) {
        if (!this.state.organizationalDepartmentIdstoDelete.includes(e.target.value)) {
          this.setState(prevState => ({ organizationalDepartmentIdstoDelete: [...prevState.organizationalDepartmentIdstoDelete, e.target.value]}))
        }
      } else {
        this.setState(prevState => ({ organizationalDepartmentIdstoDelete: prevState.organizationalDepartmentIdstoDelete.filter(item => item !== e.target.value) }));
      }
    }

  
    render() {
        return (
        <Fragment>
        <NavBar/>
        <br/>
        <h2 style={{marginTop:"2rem"}}>Додади оддели на вработен</h2><br/><br/>
            <Container>
              <form>
                <div>
                  {this.state.departments.map((department) => (
                    <label className="form-control" key={department.id} style={{ height: "auto", fontFamily: "sans-serif",
                        fontSize: "1.4rem", lineHeight: "1.5", display: "grid", gridTemplateColumns: "1em auto", gap: "0.5em" }}>
                      <Checkbox name={department.id} id={department.id} value={department.id} onChange={this.handleCheckBox}/>
                      {department.name}</label> ))}
                </div>
                  <br/>
                  <button className="btn btn-success" onClick={()=>{this.addDepartmentsToUser()}} style={{float:'right'}}>  
                      <FontAwesomeIcon icon={faPlusCircle}/><span className="btn-wrapper--label">Додели оддел</span></button>
                  <br/><br/><br/><br/>
                 <div>
                  <div className="form-group">
                    <div>
                      {this.state.userDepartments.length > 0 ? (
                      <p style={{ fontFamily: "sans-serif", fontSize: "1.5rem", fontWeight: "bold", float: "left"}}>
                        Вработениот моментално е распределен во: <br></br>
                      <ul style={{listStyleType:"none", marginTop:"30px", textAlign:"left"}}>
                          {this.state.userDepartments.map((item) => (
                            <li><Checkbox name={item.id} id={item.id} value={item.id} onChange={this.handleCheckBoxDelete}/>{item.name}</li>
                          ))}</ul>
                      </p>) : (<p style={{ fontWeight: "bold", fontFamily: "sans-serif", fontSize: "1.5rem", float: "left" }}>
                          Вработениот тековно нема оддели во кои работи!<br/>
                        </p>)}
                    </div>
                  </div><br/><br/><br/>
                  <button type="delete" class="btn btn-danger" variant="contained" onClick={()=>{this.deleteDepartmentsFromUser()}} 
                     style={{float:'right'}}>
                    <FontAwesomeIcon icon={faTrash}/> <span className="btn-wrapper--label">Отстрани оддел/и</span></button> 
                </div>
              </form>
            </Container>
        </Fragment>
        )
    }
}