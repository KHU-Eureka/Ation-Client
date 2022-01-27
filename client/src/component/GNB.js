import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import "../assets/css/GNB.css";
import logo from "../assets/svg/logo_main.svg";
import bell from "../assets/svg/bell.svg";
import profile from "../assets/svg/profile.svg";
import defaultProfile from "../assets/svg/gnb_default_profile.svg";
import { Cookies } from 'react-cookie';
import axios from 'axios';
import GNBPopup from './views/GNBPopup';

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
    let [url, setUrl] = useState("");

    useEffect(() => {
        console.log("menu",menu)
    })

    /*
    useEffect(() => {
        const target = localStorage.getItem('target');
        if (target !== null) {
            if(document.querySelector('.btn-li')) {
                const btn = document.querySelectorAll('.btn-li');
                for(var i = 0; i<btn.length; i++) {
                    if(target === btn[i].firstChild.firstChild.className) {
                        console.log(btn[i].firstChild);
                        btn[i].firstChild.firstChild.style.color = '#352C23';
                    }
                }
            }
        }
    }, [url])

    useEffect(() => {
        setUrl(window.location.href);
    }, [url])
    */

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

        if (auth) {
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
                setActivePersona(res.data);
            } catch (err) {
                console.log(err);
            }
        } 
        getActivePersona();
    }, [auth, activePersonaId])

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

    const colorHandler = (e) => {
        if(document.querySelector('.Btn-container')) {
            const btn = document.querySelectorAll('.btn-li');
            for(var i = 0; i < btn.length; i++) {
                btn[i].firstChild.firstChild.style.color = '#807A74';
                console.log(btn[i].firstChild.firstChild)
            }
        }
        e.target.style.color = '#352C23';
        localStorage.setItem('target', e.target.className);
    }


    return (
        <div className="GNB-container">
            <div className="gnb-flex-container">
            <div className="Logo-container">
                <img className="logo" src={logo} />
            </div>
            <div className="Btn-container">
                <li className="btn-li">
                <Link to="/lounge" style={{textDecoration: 'none'}}>
                    <span className="lounge-btn" id={(menu==="rounge") ? "selected-menu" : null}>
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
                <button className="openlounge-btn">Open Lounge</button>
                <img className="bell" src ={bell} width="30px" alt="bell" />
                <img className="profile-persona" src ={(auth && activePersona && activePersona.profileImgPath) ? activePersona.profileImgPath : defaultProfile} alt="persona profile" width="30px"
                onClick={()=>{setShowGNBPopup(true)}}
                />
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