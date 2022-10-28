  import './App.css';
  import React from 'react';
  import Login from './components/Login/Login.js';
  import Register from './components/Register/Register.js';
  import Test from "./components/Test.js";
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
                    <Route exact path="/test"  element={<Test/>} />
            </Routes>

          </div>
        </Router>
      );
    }
  }

  export default App;
