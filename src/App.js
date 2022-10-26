  import './App.css';
  import React from 'react';
  import Login from './components/Login/Login.js';
  import Register from './components/Register/Register.js';
  import OldRegister from './components/Register/OldRegister';
  import {
    BrowserRouter as Router,
    Routes,
    Route
  } from "react-router-dom";
  import OldLogin from './components/Login/OldLogin.js';
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
                    <Route exact path="/reg" element={<OldRegister/>}/>
              
            </Routes>

          </div>
        </Router>
      );
    }
  }

  export default App;
