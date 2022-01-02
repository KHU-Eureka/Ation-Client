import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import Alert from '../views/Alert';
import './MyPage.css';

function MyPage() {
    const cookies = new Cookies();
    const navigation = useNavigate();
    const { state } = useLocation();

    let [showAlert, setShowAlert] = useState(false);
    let [alertTitle, setAlertTitle] = useState("");
    let [alertSubtitle, setAlertSubtitle] = useState("");
    let [personaList, setPersonaList] = useState([{}, {}, {}]);
    let [personaIdList, setPersonaIdList] = useState([]);
    let [activePersona, setActivePersona] = useState([null]);
    let [activePersonaId, setActivePersonaId] = useState();

    const goToAddPersona = () => {
        navigation('/create-persona');
    }

    useEffect(() => { // state 존재 여부 검사
        if (state !== null) {
            // Alert 띄워야 하는지 검사
            if (state.alert !== null) {
                setAlertTitle(state.alert.title);
                setAlertSubtitle(state.alert.subTitle);
                setShowAlert(true);
            }
        }
    }, [])

    useEffect(() => {
        const getPersonaList = async () => {
            const token = cookies.get('token')
            try {
                const res = await axios.get(
                    'http://52.78.105.195/api/persona', {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )
                setPersonaList(res.data)
                var temp = []
                for(var persona of res.data) {
                    temp = [...temp, persona.id]
                }
                setPersonaIdList(temp)
                console.log(res.data)
                console.log("personaList",personaList);
            } catch (err) {
                console.log(err);
            }
        }  
        getPersonaList();

        const getActivePersona = async () => {
            const token = cookies.get('token')
            try {
                const res = await axios.get(
                    'http://52.78.105.195/api/persona/user', {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )
                setActivePersona(res.data)
                setActivePersonaId(res.data.id)
                console.log("activePersona",res.data);
            } catch (err) {
                console.log(err);
            }
        }  
        getActivePersona();
    }, [])

    const changeActivePersona = async (personaId) => {
        const token = cookies.get('token')
        try {
            await axios.put(
                'http://52.78.105.195/api/persona/user/' + personaId, {},
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            )
            setActivePersonaId(personaId)
        } catch (err) {
            console.log(err)
        }
    }

    const editPersona = (personaId) => {
        navigation('/persona-edit', { state: { personaId: personaId, personaIdList: personaIdList } })
        console.log(personaId);
    }



    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Alert alertTitle={alertTitle} alertSubtitle={alertSubtitle} showAlert={showAlert} setShowAlert={setShowAlert}/>
            <div className="background-img">
                <div className="profile-wrapper">
                    {
                        personaList && personaList.map(function(persona, idx) {
                            return (
                                <div onClick={(e)=>{e.preventDefault(); changeActivePersona(persona.id)}}
                                key={idx}>
                                {
                                    (persona === {})
                                    /* persona가 없을 때 */
                                    ? <div className="persona-profile">
                                        <div className="add-persona-btn"
                                            onClick={ goToAddPersona }
                                        >+</div>
                                    </div>
                                    /* persona가 있을 때 */
                                    : <div className="persona-profile"
                                    id={persona.id===activePersonaId ? 'active-persona-profile' : null}>
                                        { persona.nickname }
                                        <button 
                                        onClick={(e)=>{e.preventDefault(); editPersona(persona.id)}}
                                        >페르소나 수정</button>
                                    </div>
                                }
                                </div>
                            )
                        })
                    }
                </div>

            </div>

            <div className="pin-box-content">

            </div>


        </div>
    )
}

export default MyPage;