import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import '../../assets/css/mypage/mypage.css';

import Idaition from "./Idaition";
import Pinbox from "./Pinbox";
import GNB from "../GNB";

function MyPage() {
    const cookies = new Cookies();
    const navigation = useNavigate();

    let [personaList, setPersonaList] = useState([{}, {}, {}]);
    let [activePersona, setActivePersona] = useState([null]);
    let [activePersonaId, setActivePersonaId] = useState();

    let [EditTrue, setEditTrue] = useState(false);
    let [EditClickTrue, setEditClickTrue] = useState(false);
    let [EditModalClose, setEditModalClose] = useState(false);

    const goToAddPersona = () => {
        navigation('/create-persona');
    }

    useEffect(() => {
        const getPersonaList = async () => {
            const token = cookies.get('token')
            try {
                const res = await axios.get(
                    process.env.REACT_APP_SERVER_HOST + '/api/persona', {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )
                setPersonaList(res.data)
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
                    process.env.REACT_APP_SERVER_HOST + '/api/persona/user', {
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
        console.log('token', token);
        try {
            const res = await axios.put(
                process.env.REACT_APP_SERVER_HOST + '/api/persona/user/' + personaId, {},
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            )
            setActivePersonaId(personaId)
            alert("활동 페르소나 변경 성공")
        } catch (err) {
            alert("활동 페르소나 변경 실패")
            console.log(err)
        }
    }

    const editPersona = (personaId) => {
        navigation('/persona-edit', { state: { personaId: personaId } })
        console.log(personaId);
    }

    return (
        <div className="background-img2">
        <GNB />
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
            <div className="Idaition-container">
                <Idaition />
            </div>  
            <div className="Pinbox-container">
                <Pinbox activePersonaId={activePersonaId} EditModalClose={EditModalClose}/>
            </div>
        </div>
    )
}

export default MyPage;