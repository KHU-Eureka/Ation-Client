import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import "../assets/css/GNB.css";
import logo from "../assets/svg/logo_main.svg";
import bell from "../assets/svg/bell.svg";
import defaultProfile from "../assets/svg/gnb_default_profile.svg";
import { Cookies } from 'react-cookie';
import axios from 'axios';
import GNBPopup from './views/GNBPopup';
import OpenLounge from "./open_lounge/OpenLounge";

function GNB() {
    const cookies = new Cookies();
    let activePersonaId = useSelector((state) => state.activePersonaId);
    let menu = useSelector((state)=> state.menu);
    let auth = useSelector((state) => state.auth);
    let dispatch = useDispatch();

    // GNB Popup 관련
    let [showGNBPopup, setShowGNBPopup] = useState(false);

    // persona 관련
    let [activePersona, setActivePersona] = useState(null);

    // user 관련
    let [email, setEmail] = useState(""); 

    // open lounge 관련
    let [showOpenLounge, setShowOpenLounge] = useState(false);

    useEffect(() => {
        const getEmail = async () => {
            const token = localStorage.getItem('token')
            try {
                const res = await axios.get(
                    process.env.REACT_APP_SERVER_HOST+'/api/auth/user', {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )
                setEmail(res.data.email);
            } catch(err) {
                console.log(err);
            }
        }
        if (auth) {
            getEmail();
        }
    }, [auth])

    useEffect(() => {
        const getActivePersona = async () => {
            const token = localStorage.getItem('token')
            try {
                const res = await axios.get(
                    process.env.REACT_APP_SERVER_HOST + '/api/persona/user', {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )
                console.log(res);
                dispatch({type: 'AUTH', data: true});
                dispatch({type: 'CHANGEPERSONA', data: res.data.id});
                setActivePersona(res.data);
            } catch (err) {
                console.log(err);
            }
        } 
        if (auth) {
            getActivePersona();
        }
    }, [auth, activePersonaId])

    const changeActivePersona = async (persona) => {
        const token = localStorage.getItem('token')
        try {
            await axios.put(
                process.env.REACT_APP_SERVER_HOST+'/api/persona/user/' + persona.id, {},
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            )
            dispatch({type: 'CHANGEPERSONA', data: persona.id})
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="GNB-container">
            { showOpenLounge && <OpenLounge setShowOpenLounge={setShowOpenLounge}/> }
            <div className="gnb-flex-container">
            <div className="Logo-container">
                <img className="logo" src={logo} alt="logo" onClick={() => { window.location.replace(`/landing`); }} style={{cursor: 'pointer'}}/>
            </div>
            <div className="Btn-container">
                <li className="btn-li">
                <Link to="/lounge" style={{textDecoration: 'none'}}>
                    <span className="lounge-btn" id={(menu==="lounge") ? "selected-menu" : null}>
                        Lounge
                    </span>
                </Link>
                </li>
                <li className="btn-li">
                <Link to="/insight" style={{textDecoration: 'none'}}>
                    <span className="insight-btn" id={(menu==="insight") ? "selected-menu" : null}>
                        Insight
                    </span>
                </Link>
                </li>
                <li className="btn-li">
                <Link to="/mypage" style={{textDecoration: 'none'}}>
                    <span className="mypage-btn" id={(menu==="mypage") ? "selected-menu" : null}>
                        Mypage
                    </span>
                </Link>
                </li>
            </div>
            <div className="Profile-container">
                <button className="openlounge-btn"
                onClick={()=>{setShowOpenLounge(true)}}>Open Lounge</button>
                <img className="bell" src ={bell} width="30px" alt="bell" />
                {
                    auth
                    ? <img className="profile-persona" src ={(auth && activePersona && activePersona.profileImgPath) ? activePersona.profileImgPath : defaultProfile} alt="persona profile" width="30px"
                    onClick={()=>{setShowGNBPopup(true)}}
                    />
                    : <button className="login-btn" onClick={()=>{dispatch({type: 'LOGIN', data: true})}}>
                        Log In
                    </button>
                }

                { 
                (auth && showGNBPopup) &&
                <GNBPopup email={email} showGNBPopup={showGNBPopup} setShowGNBPopup={setShowGNBPopup} activePersona={activePersona} changeActivePersona={changeActivePersona}></GNBPopup> 
                }
            </div>
            </div>
        </div>
    );
}

export default GNB;