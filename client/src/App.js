import React from "react";
import { BrowserRouter, BrowserRouter as Router, Navigate, Route, Routes, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAsync } from 'react-async';
import GNB from "./component/GNB";

import Insight_Read from "../src/component/insight/Read";
import Insight_Create from "../src/component/insight/Create";
import MyPage from "../src/component/mypage/MyPage";

import './App.css';

import Landing from "../src/component/landing/Landing";
import Login from "../src/component/login/Login";
import SignUp from "../src/component/signup/SignUp";

import Persona_Create from "../src/component/persona/Create";
import MyPersona from "../src/component/persona/MyPersona";

import isValidUser from "./component/isValidUser";

import axios from 'axios';
import { Cookies } from 'react-cookie';

import "./App.css";
import "./Fonts.css";
import "./Input.css";
import "./Modal.css";

function App() {
  // login이 되어있지 않다면 -> public page가 모두 보임 / privated가 모두 보이지 않음
  // login이 되어있다면 -> public과 private가 모두 보임 / public이고 restricted인 페이지는 안보임

  return (
    <div className="App">
      <Router>
        <GNB />
        <Routes>        

          {/* Private Pages */}  
          <Route path="/insight" element={<PrivateOutlet/>}>
            <Route exact path="" element={<Insight_Read/>} />
            <Route exact path="create" element={<Insight_Create/>} />
          </Route>

          <Route path="/persona-create" element={<PrivateOutlet/>}>
            <Route exact path="" element={<Persona_Create/>} />
          </Route>

          <Route path="/mypersona/:mode" element={<PrivateOutlet/>}>
            <Route exact path="" element={<MyPersona/>} />
          </Route>

          <Route path="/mypage" element={<PrivateOutlet/>}>
            <Route exact path="" element={<MyPage/>} />
          </Route>
          
          {/* Public & restricted Pages */}
          <Route path="/login" element={<PublicOutlet/>} >
            <Route exact path="" element={<Login/>} />
          </Route>

          <Route path="/signup" element={<PublicOutlet/>} >
            <Route exact path="" element={<SignUp/>} />
          </Route>
        
          {/* Public Pages */}
          <Route exact path="/landing" element={<Landing/>} />    

          {/* NotFound Pages */}
          <Route path="*" element={<NotFound/>}></Route>

        </Routes>

      </Router>
    </div>
  );

}





function PrivateOutlet() {
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const navigation = useNavigate();
  var token = cookies.get('token');

  const { data: auth, error, isPending } = useAsync({
    promiseFn: isValidUser,
    token: token,
    watch: token
  });

  if (isPending) {
    return <div>로딩중</div>
  } 
  if (error) {
    dispatch({type: 'AUTH', data: false});
    return <Navigate to="/login" />
    //return <Navigate to="/login" />
  } 
  if (auth.message==="Unathorized") { // 로그인 되지 않거나 유효하지 않은 유저라면,
    dispatch({type: 'AUTH', data: false});
    return <Navigate to="/login" />
  } else { // 유효한 유저라면,
    dispatch({type: 'AUTH', data: true});
    return <Outlet /> ;
  }  
}

function PublicOutlet() {
  const dispatch = useDispatch();
  const cookies = new Cookies();
  var token = cookies.get('token');

  const { data: auth, error, isPending } = useAsync({
    promiseFn: isValidUser,
    token: token,
    watch: token
  });

  if (isPending) {
    return <div>로딩중</div>
  } 
  if (error) { // 에러 발생 시 login으로 이동
    dispatch({type: 'AUTH', data: false});
    return <Outlet />
  } 
  if (auth.message==="Unathorized") { // 유효하지 않은 유저라면
    dispatch({type: 'AUTH', data: false});
    return <Outlet />
  } else { // 로그인 된 유저라면
    dispatch({type: 'AUTH', data: true});
    return <Navigate to="/mypage" /> ;
  }  
}

function NotFound() {
  const dispatch = useDispatch();
  const cookies = new Cookies();
  var token = cookies.get('token');

  const { data: auth, error, isPending } = useAsync({
    promiseFn: isValidUser,
    token: token,
    watch: token
  });

  if (isPending) {
    return <div>로딩중</div>
  } 
  if (error) { // 에러 발생 시 login으로 이동
    dispatch({type: 'AUTH', data: false});
    return <Navigate to="/login" />
  } 
  if (auth.message==="Unathorized") { // 유효하지 않은 유저라면
    dispatch({type: 'AUTH', data: false});
    return <Navigate to="/login" />
  } else { // 로그인 된 유저라면
    dispatch({type: 'AUTH', data: true});
    return <Navigate to="/mypage" /> ;
  }  
}


export default App;