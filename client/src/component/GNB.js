import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import "../assets/css/GNB.css";
import logo from "../assets/svg/logo_main.svg";
import bell from "../assets/svg/bell.svg";
import profile from "../assets/svg/profile.svg";
import { Cookies } from 'react-cookie';
import axios from 'axios';
import GNBPopup from './views/GNBPopup';

function GNB() {
    const cookies = new Cookies();
    let activePersonaId = useSelector((state) => state.activePersonaId);
    let auth = useSelector((state) => state.auth);
    let dispatch = useDispatch();

    // GNB Popup 관련
    let [showGNBPopup, setShowGNBPopup] = useState(false);

    // persona 관련
    let [personaList, setPersonaList] = useState([]);
    let [activePersona, setActivePersona] = useState(null);

    // user 관련
    let [email, setEmail] = useState(""); 

    useEffect(() => { // active persona id 가 변결될 때 active persona를 찾기
        if (auth) {
            for (var persona of personaList) {
                if (persona && persona.id === activePersonaId) {
                    setActivePersona(persona);
                    break;
                }
            } 
        } 
    }, [activePersonaId, auth])

    useEffect(() => {
        const getEmail = async () => {
            const token = cookies.get('token')
            try {
                const res = await axios.get(
                    process.env.REACT_APP_SERVER_HOST+'/api/auth', {
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
        const getPersonaList = async () => {
            const token = cookies.get('token')
            try {
                const res = await axios.get(
                    process.env.REACT_APP_SERVER_HOST+'/api/persona', {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )

                var tempPersonaList = res.data;
                setPersonaList(tempPersonaList)
            } catch (err) {
                console.log(err);
            }
        }
        if (auth) {
            getPersonaList();
            getEmail();
        }
    }, [auth])

    useEffect(() => {
        const getActivePersona = async () => {
            const token = cookies.get('token')
            try {
                const res = await axios.get(
                    process.env.REACT_APP_SERVER_HOST + '/api/persona/user', {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )
                dispatch({type: 'CHANGEPERSONA', data: res.data.id});
                dispatch({type: 'AUTH', data: true});
                console.log(auth,res.data.id);
            } catch (err) {
                console.log(err);
            }
        } 
        getActivePersona();
    }, [])

    const changeActivePersona = async (persona) => {
        const token = cookies.get('token')
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
            <div className="gnb-flex-container">
            <div className="Logo-container">
                <img className="logo" src={logo} alt="logo" />
            </div>
            <div className="Btn-container">
                <li className="btn-li">
                    <span className="lounge-btn">Lounge</span>
                </li>
                <li className="btn-li">
                <Link to="/insight" style={{textDecoration: 'none'}}>
                    <span className="insight-btn">Insight</span>
                </Link>
                </li>
                <li className="btn-li">
                <Link to="/mypage" style={{textDecoration: 'none'}}>
                    <span className="mypage-btn">Mypage</span>
                </Link>
                </li>
            </div>
            <div className="Profile-container">
                <button className="openlounge-btn">Open Lounge</button>
                <img className="bell" src ={bell} width="30px" alt="bell" />
                <img className="profile-persona" src ={(auth && activePersona && activePersona.profileImgPath) ? activePersona.profileImgPath : profile} alt="persona profile" width="30px"
                onClick={()=>{setShowGNBPopup(true)}}
                />
                { 
                (auth && showGNBPopup && personaList.length > 1) &&
                <GNBPopup email={email} showGNBPopup={showGNBPopup} setShowGNBPopup={setShowGNBPopup} activePersona={activePersona} changeActivePersona={changeActivePersona}></GNBPopup> 
                }
            </div>
            </div>
        </div>
    );
}

export default GNB;