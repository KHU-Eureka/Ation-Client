import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GNB from "./component/GNB";

/* Router 관련 */
import PublicOutlet from "./component/router/PublicOutlet";
import PrivateOutlet from "./component/router/PrivateOutlet";
import NotFound from "./component/router/NotFound";

/* Persona 관련 */
import PersonaCreate from "../src/component/persona/Create";
import MyPersona from "../src/component/persona/MyPersona";

/* Insight 관련 */
import InsightRead from "../src/component/insight/Read";
import InsightCreate from "../src/component/insight/Create";

/* Lounge 관련 */
import Lounge from "../src/component/lounge/Lounge";
import LoungeRoom from "./component/lounge_room/LoungeRoom";

import Login from "../src/component/login/Login";
import LoginLoading from "./component/login/LoginLoading";
import SignUp from "../src/component/signup/SignUp";
import MyPage from "../src/component/mypage/MyPage";
import Landing from "../src/component/landing/Landing";


import "./assets/css/App.css";
import "./assets/css/input/Input.css";
import "./assets/css/modal/ModalBig.css";

// font
import "./assets/font/trap/Trap.css";

function App() {
  // login이 되어있지 않다면 -> public page가 모두 보임 / privated가 모두 보이지 않음
  // login이 되어있다면 -> public과 private가 모두 보임 / public이고 restricted인 페이지는 안보임

  return (
    <div className="App">
      
      {/* <NavigationBar /> */}
      <Router>
        <GNB />
        <Routes>        

          {/* Private Pages */}  
          <Route path="/insight" element={<PrivateOutlet/>}>
            <Route exact path="" element={<InsightRead/>} />
            <Route exact path="create" element={<InsightCreate/>} />
          </Route>

          <Route path="/persona-create" element={<PrivateOutlet/>}>
            <Route exact path="" element={<PersonaCreate/>} />
          </Route>

          <Route path="/mypersona/:mode" element={<PrivateOutlet/>}>
            <Route exact path="" element={<MyPersona/>} />
          </Route>

          <Route path="/mypage" element={<PrivateOutlet/>}>
            <Route exact path="" element={<MyPage/>} />
          </Route>

          {/* Rounge Pages */}
          <Route path="/lounge" element={<PrivateOutlet/>}>
            <Route exact path="" element={<Lounge/>} />
          </Route>

          <Route path="/lounge-room/:id" element={<PrivateOutlet/>}>
            <Route path="" element={<LoungeRoom/>}/>
          </Route>
          
          {/* Public & restricted Pages */}
          <Route path="/login" element={<PublicOutlet/>} >
            <Route exact path="" element={<Login/>} />
          </Route>
          <Route path="/oauth2/redirect" element={<PublicOutlet/>} >
            <Route exact path="" element={<LoginLoading/>} />
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

export default App;