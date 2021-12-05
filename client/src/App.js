import { React } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Insight_Read from "../src/component/insight/Read";
import Insight_Create from "../src/component/insight/Create";

import Landing from "../src/component/landing/Landing";
import Login from "../src/component/login/Login";
import SignUp from "../src/component/signup/SignUp";

import Persona_Create from "../src/component/persona/Create";


import "./App.css";
import "./Input.css";
import "./Modal.css";

function App() {
  return (
    <div className="App">
      <div className="nav-bar">
        navigation bar
      </div>
      
      <Router>
        <Routes>
          <Route exact path="/insight" element={<Insight_Read/>} />
          <Route exact path="/insight/create" element={<Insight_Create/>} />
          
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/signup" element={<SignUp/>} />
          <Route exact path="/landing" element={<Landing/>} />

          <Route exact path="/persona-create" element={<Persona_Create/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;