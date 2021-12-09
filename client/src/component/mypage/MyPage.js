import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import '../../assets/css/mypage/mypage.css';

function MyPage() {
    const cookies = new Cookies();
    const navigation = useNavigate();

    let [personaList, setPersonaList] = useState([{}, {}, {}]);
    let [activePersona, setActivePersona] = useState([null]);
    let [activePersonaId, setActivePersonaId] = useState();

    const goToAddPersona = () => {
        navigation('/create-persona');
    }

    useEffect(() => {
        const getPersonaList = async () => {
            const token = cookies.get('token')
            try {
                const res = await axios.get(
                    'http://163.180.117.22:7218/api/persona', {
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
                    'http://163.180.117.22:7218/api/persona/user', {
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
                'http://163.180.117.22:7218/api/persona/user/' + personaId, {},
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
        <div style={{ width: '100%', height: '100%' }}>
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