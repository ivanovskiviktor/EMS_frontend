  import React, { Component, Fragment } from "react";
  import UserService from "../service/UserService";
  import NavBar from "../shared/components/NavBar/NavBar";
  import Container from "react-bootstrap/Container";
  import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
  import {faPlusCircle, faTrash} from "@fortawesome/free-solid-svg-icons";


  export default class UsersHead extends Component{

      constructor(props) {
          super(props);
          this.state = {
            headUsers: [],
            id: this.props.match.params.id,
            headId: null, 
            userHead: null,
            headUserFirstName: "",
            headUserLastName: "",
          };
        }

        async componentDidMount() {
          await this.getAllHeadUsers();
          await this.getUserHeadById(this.state.id);
      }
    
        handleChange = (e) =>
          this.setState({
              headId: e.target.value
          });

        
        getUserHeadById(id) {
          UserService.getUserById(id).then((res) => {
            this.setState({
              userHead: res.data.headId,
              headUserFirstName: res.data.headFirstName,
              headUserLastName: res.data.headLastName,
              });
          });
        }

        getAllHeadUsers() {
          UserService.getHeadUsers()
            .then((response) => response.data)
            .then((data) => {
              this.setState({
                  headUsers: data,
              });
            });  
        }
    

        addHeadToUser(){
          const headUserHelper={
            id:this.state.id,
            headId:this.state.headId
          }  
          UserService.setHeadUserForUser(headUserHelper)
          .then((response) => response.data)
          .then((data) => {
            this.setState({
              headId: data.content
            });
          });
          }

          removeHeadUserFromUser(){
          const headUserHelper={
              id:this.state.id,
              headId:null
          }  
          UserService.removeHeadUserForUser(headUserHelper)
          .then((response) => response.data)
          .then((data) => {
              this.setState({
                  headId: data.content
              });
          });
          }

      render() {
          return (
            <Fragment>
            <NavBar/>
            <br/>
            <h2 style={{marginTop:"2rem"}}>Додели раководител на вработен</h2><br/><br/>
              <Container>
                <form>
                  <div>
                    {this.state.headUsers.map((user) => (
                      <label className="form-control" style={{ height: "auto", fontFamily: "sans-serif", fontSize: "1.4rem",
                        lineHeight: "1.5", display: "grid", gridTemplateColumns: "1em auto", gap: "0.5em" }}>
                        <input type="radio" value={user.id} name="headId" id={user.id} onChange={this.handleChange}/>
                        {user.person.firstName} {user.person.lastName} ({user.email}) </label>
                    ))}</div>
                    <br/>
                    <button className="btn btn-success" onClick={()=>{this.addHeadToUser()}} style={{float:'right'}}>  
                      <FontAwesomeIcon icon={faPlusCircle}/><span className="btn-wrapper--label">Додели раководител</span></button>
                    <br/><br/><br/><br/>
                    <div>
                    {this.state.userHead !== null ? (<div className="form-group">
                      <div>
                        <p style={{  fontFamily: "sans-serif", fontSize: "1.5rem", float: "left"}}>
                          Тековен раководител на вработениот е: <b>{this.state.headUserFirstName} {this.state.headUserLastName}</b>
                          <br/>
                        </p>
                      </div>
                    </div>) : (<div className="form-group">
                      <div>
                        <p style={{ fontWeight: "bold", fontFamily: "sans-serif", fontSize: "1.5rem", float: "left" }}>
                          Вработениот тековно нема доделено раководител!<br/>
                        </p>
                      </div>
                    </div>)} <br/><br/><br/>
                    <button type="delete" class="btn btn-danger" variant="contained" onClick={()=>{this.removeHeadUserFromUser()}} 
                     style={{float:'right'}}>
                    <FontAwesomeIcon icon={faTrash}/> <span className="btn-wrapper--label">Отстрани раководител</span></button>                  
                  </div>
                </form>
              </Container>
          </Fragment>
          )
      }
  } 