import React, { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import GNBPopup from './GNBPopup';

function NavigationBar() {
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
        <div className="nav-bar">
        { activePersona &&
        <img
        className="active-persona-image"
        alt="persona profile"
        src={activePersona.profileImgPath}
        onClick={()=>{setShowGNBPopup(!showGNBPopup)}}>
        </img>
        }
        { activePersona &&
        <GNBPopup email={email} showGNBPopup={showGNBPopup} setShowGNBPopup={setShowGNBPopup} activePersona={activePersona} changeActivePersona={changeActivePersona} personaList={personaList}></GNBPopup> 
        }
        </div>
    )
}

export default NavigationBar;