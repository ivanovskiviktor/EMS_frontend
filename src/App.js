  import './App.css';
  import React from 'react';
  import Login from './components/Login/Login.js';
  import Register from './components/Register/Register.js';
  import Dashboard from './components/Dashboard/Dashboard';
  import OrganizationalDepartmentList from './components/OrganizationalDepartments/OrganizationalDepartmentsList';
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
                    <Route exact path="/dashboard" element={<Dashboard/>}/>
                    <Route exact path="/orgDepartments" element={<OrganizationalDepartmentList/>}/>
            </Routes>

          </div>
        </Router>
      );
    }
  }

  export default App;
