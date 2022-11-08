  import './App.css';
  import React from 'react';
  import Login from './components/Login/Login.js';
  import Register from './components/Register/Register.js';
  import OrganizationalDepartmentList from './components/OrganizationalDepartments/OrganizationalDepartmentsList.js';
  import WorkingTasksList from './components/WorkingTasks/WorkingTasksList.js';
  import StatusList from './components/Statuses/StatusList.js';
  import {
    BrowserRouter as Router,
    Routes,
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
            <Routes>
                    <Route exact path='/' element={<Login/>} />
                    <Route exact path="/register" element={<Register/>} />
                    <Route exact path="/orgDepartments" element={<OrganizationalDepartmentList/>}/>
                    <Route exact path="/workingTasks" element={<WorkingTasksList/>}/>
                    <Route exact path="/statuses" element={<StatusList/>}/>
            </Routes>

          </div>
        </Router>
      );
    }
  }

  export default App;
