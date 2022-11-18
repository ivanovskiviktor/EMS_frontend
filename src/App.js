  import './App.css';
  import React from 'react';
  import Login from './components/Login/Login.js';
  import Register from './components/Register/Register.js';
  import OrganizationalDepartmentList from './components/OrganizationalDepartments/OrganizationalDepartmentsList.js';
  import WorkingTasksList from './components/WorkingTasks/WorkingTasksList.js';
  import StatusList from './components/Statuses/StatusList.js';
  import OrganizationalDepartmentModify from './components/OrganizationalDepartments/OrganizationalDepartmentModify';
  import OrganizationalDepartmentAddHead from './components/OrganizationalDepartments/OrganizationalDepartmentAddHead';
  import Administration from './components/Administration/Administration';
  import UsersHead from './components/Administration/UsersHead';
  import UsersDepartments from './components/Administration/UsersDepartments';
  import NotesList from './components/Notes/NotesList';
  import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
  class App extends React.Component {
    constructor(props) {
      super(props)

    
    }


    render() {
      return (
        <Router>
          <div className="App">
            <Switch>
                    <Route exact path='/' component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/orgDepartments" component={OrganizationalDepartmentList}/>
                    <Route exact path="/workingTasks" component={WorkingTasksList}/>
                    <Route exact path="/statuses" component={StatusList}/>
                    <Route exact path="/modifyDepartment" component={OrganizationalDepartmentModify}/>
                    <Route exact path="/modifyDepartmentHead/:id" component={OrganizationalDepartmentAddHead}/>
                    <Route exact path="/administration" component={Administration}/>
                    <Route exact path="/UsersHead/:id" component={UsersHead} />
                    <Route exact path="/UsersDepartments/:id" component={UsersDepartments} />
                    <Route exact path="/notes" component={NotesList}/>
            </Switch>

          </div>
        </Router>
      );
    }
  }

  export default App;
