import { React, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Cookies } from 'react-cookie';
import axios from 'axios';

import NavigationBar from "./component/views/NavigationBar";

import Insight_Read from "../src/component/insight/Read";
import Insight_Create from "../src/component/insight/Create";

import Landing from "../src/component/landing/Landing";
import Login from "../src/component/login/Login";
import SignUp from "../src/component/signup/SignUp";

import Persona_Create from "../src/component/persona/Create";
import Persona_Edit from "../src/component/persona/Edit";
import MyPersona from "../src/component/persona/MyPersona";


import MyPage from "../src/component/mypage/MyPage";

import "./App.css";
import "./Fonts.css";
import "./Input.css";
import "./Modal.css";

function App() {
  const cookies = new Cookies();
  let [isAuthorized, setIsAuthorized] = useState(null)

  useEffect(() => {
    const getAuthorization = async () => {
      var token = cookies.get('token');
      try {
          const res = await axios.get(
              'http://52.78.105.195/api/auth', {
                headers: {
                  Authorization: "Bearer " + token
                }
              }
          )
          // 유효힌 토근인지 판단
          setIsAuthorized(res.message==="Unathorized" ? false : true)
      } catch (err) {
          console.log(err);
      }
    }
    getAuthorization();
  }, [])

  return (
    <div className="App">
      <NavigationBar></NavigationBar>
      
      <Router>
        <Routes>
          <Route exact path="/insight" element={<Insight_Read/>} />
          <Route exact path="/insight/create" element={<Insight_Create/>} />
          
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/signup" element={<SignUp/>} />
          <Route exact path="/landing" element={<Landing/>} />

          <Route exact path="/persona-create" element={<Persona_Create/>} />
          <Route exact path="/persona-edit" element={<Persona_Edit/>} />
          <Route exact path="/mypersona/:mode" element={<MyPersona/>}></Route>

          <Route exact path="/mypage" element={<MyPage/>} />

          { isAuthorized !== null && isAuthorized
          ? null
          : <Route path="*" element={<Navigate to="/login" />} />
          }
        </Routes>
      </Router>
    </div>
  );
}

export default App;