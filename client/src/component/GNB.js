import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "../assets/css/GNB.css";
import logo from "../assets/svg/logo_main.svg";
import bell from "../assets/svg/bell.svg";
import profile from "../assets/svg/profile.svg";
import { Cookies } from 'react-cookie';
import axios from 'axios';
import GNBPopup from './views/GNBPopup';

function GNB() {
    const cookies = new Cookies();

    // GNB Popup 관련
    let [showGNBPopup, setShowGNBPopup] = useState(false);
    
    // user 관련
    let [email, setEmail] = useState("");

    // persona 관련
    let [personaList, setPersonaList] = useState([]);
    let [personaIdList, setPersonaIdList] = useState([]);
    let [activePersona, setActivePersona] = useState(null);
    let [activePersonaId, setActivePersonaId] = useState();

    useEffect(() => {
        const getEmail = async () => {
            const token = cookies.get('token')
            try {
                const res = await axios.get(
                    'http://52.78.105.195:8081/api/auth', {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )
                setEmail(res.data.email)
            } catch(err) {
                console.log(err);
            } 
        }

        const getPersonaList = async () => {
            const token = cookies.get('token')
            try {
                const res = await axios.get(
                    'http://52.78.105.195:8081/api/persona', {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )
                // persona List 의 length를 3으로 맞춰줌
                var tempPersonaList = res.data;
                for(var i=0; i<(3 - res.data.length); i++) {
                    tempPersonaList = [...tempPersonaList, null];
                }
                setPersonaList(tempPersonaList)

                // personaIdList를 만듦
                var tempIdList = []
                for(var persona of res.data) {
                    tempIdList = [...tempIdList, persona.id]
                }
                setPersonaIdList(tempIdList)
            } catch (err) {
                console.log(err);
            }
        }

        const getActivePersona = async () => {
            const token = cookies.get('token')
            try {
                const res = await axios.get(
                    'http://52.78.105.195:8081/api/persona/user', {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )
                setActivePersona(res.data)
                setActivePersonaId(res.data.id)
            } catch (err) {
                console.log(err);
            }
        }  

        getEmail();
        getPersonaList();
        getActivePersona();
    }, [])

    const openGNBPopup = () => {
        setShowGNBPopup(true)
    }

    const changeActivePersona = async (persona) => {
        const token = cookies.get('token')
        try {
            await axios.put(
                'http://52.78.105.195:8081/api/persona/user/' + persona.id, {},
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            )
            /*setActivePersona(persona)*/
            window.location.reload();
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <div className="GNB-container">
            <div className="Logo-container">
                <img className="logo" src={logo} />
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
                <img className="bell" src ={bell} width="30px" />
                <img className="active-persona-image" src ={activePersona? activePersona.profileImgPath : profile} alt="persona profile" width="30px"
                onClick={()=>{setShowGNBPopup(!showGNBPopup)}}/>
                { activePersona &&
                <GNBPopup email={email} showGNBPopup={showGNBPopup} setShowGNBPopup={setShowGNBPopup} activePersona={activePersona} changeActivePersona={changeActivePersona} personaList={personaList}></GNBPopup> 
                }
            </div>
        </div>
    );
}

export default GNB;