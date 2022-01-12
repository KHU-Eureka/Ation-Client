import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaExchangeAlt } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';
import Alert from '../views/Alert';
import './MyPage.css';

import eye from '../../asset/images/sense/눈_white.png';
import nose from '../../asset/images/sense/코_white.png';
import mouse from '../../asset/images/sense/입_white.png';
import ears from '../../asset/images/sense/귀_white.png';
import hand from '../../asset/images/sense/손_white.png';

function MyPage() {
    const cookies = new Cookies();
    const navigation = useNavigate();
    const { state } = useLocation();
    
    const senseIcons = [eye, nose, mouse, ears, hand];
    
    // alert 관련
    let [showAlert, setShowAlert] = useState(false);
    let [alertTitle, setAlertTitle] = useState("");
    let [alertSubtitle, setAlertSubtitle] = useState("");

    // background image 관련
    let [formData, setFormData] = useState(null);
    let [backgroundImgUrl, setBackgroundImgUrl] = useState("");

    // persona 관련
    let [personaList, setPersonaList] = useState([]);
    let [personaIdList, setPersonaIdList] = useState([]);
    let [activePersona, setActivePersona] = useState([null]);
    let [activePersonaId, setActivePersonaId] = useState();

    const goToAddPersona = () => {
        navigation('/persona-create'); // persona 생성 페이지로 이동
    }

    useEffect(() => {   
        for (var i = 0; i < 3; i++) {
            if (personaList[i] && personaList[i].id === activePersonaId) {
                swapActivePersona(i);
            }
        }
    })

    useEffect(() => {
        // 초기값 설정
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

                // active Persona의 위치를 중간으로 오도록
                console.log(1)
                console.log("activePersonaID", activePersonaId)

                console.log(2)
            } catch (err) {
                console.log(err);
            }
        }

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
                console.log(3)
            } catch (err) {
                console.log(err);
            }
        }  

        const getBackgroundImg = async () => {
            const token = cookies.get('token')
            try {
                const res = await axios.get(
                    'http://52.78.105.195/api/auth', {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )
                setBackgroundImgUrl(res.data.myPageImgPath)
            } catch (err) {
                console.log(err);
            }
        }
        getBackgroundImg();
        getActivePersona();
        getPersonaList();  
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
            /*
            // personaList의 가운데에 위치하도록 swap
            for (var i=0; i<3; i++) {
                if (personaList[i] && personaList[i].id === personaId) {
                    swapActivePersona(i);
                }
            }
            */
            window.location.reload();
        } catch (err) {
            console.log(err)
        }
    }

    const swapActivePersona = (idx) => { // active persona를 항상 personaList의 중간에 위치하도록 함
        if (idx !== 1) { // 중간 위치가 아닐 때
            var temp = personaList[idx];
            var tempList = JSON.parse(JSON.stringify(personaList))
            tempList[idx] = JSON.parse(JSON.stringify(tempList[1]))
            tempList[1] = temp;
            setPersonaList(tempList);
        }
    }

    const editPersona = (personaId) => {
        navigation('/persona-edit', { state: { personaId: personaId, personaIdList: personaIdList } })
        console.log(personaId);
    }

    const readImage = (input) => {
        // file이 존재하는 경우
        if (input.files && input.files[0]) {
            const reader = new FileReader()
            reader.onload = e => {
                setBackgroundImgUrl(e.target.result)
            }
            reader.readAsDataURL(input.files[0])
        }
    }

    const onChangeImg = (e) => {
        e.preventDefault();
        if (e.target.files) {
            const uploadFile = e.target.files[0]
            const formData = new FormData()
            formData.append('myPageImg', uploadFile)
            setFormData(formData)
        }
    }

    useEffect(() => {
        const postBackgroundImg = async () => {
            const token = cookies.get('token')
            try {
                await axios.post(
                    'http://52.78.105.195/api/mypage/image', formData, {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )
                setAlertTitle("배경 이미지 변경에 성공했습니다")
                setAlertSubtitle("분위기가 달라졌네요!")
                setShowAlert(true)
            } catch (err) {
                setAlertTitle("배경 이미지 변경에 실패했습니다")
                setAlertSubtitle("다시 시도해주세요")
                setShowAlert(true)
                console.log(err);
            }
        }
        formData &&  postBackgroundImg();
    }, [formData])


    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Alert alertTitle={alertTitle} alertSubtitle={alertSubtitle} showAlert={showAlert} setShowAlert={setShowAlert}/>
            <div 
            className="background-img"
            style={{backgroundImage: "url('"+backgroundImgUrl+"')"}}>
                <input 
                type="file"
                id="background-img"
                style={{ display: 'none'}}
                onChange={ (e)=>{ readImage(e.target); onChangeImg(e); } }
                ></input>
                <label
                id="background-image-label"
                htmlFor="background-img"
                ><IoMdSettings/>
                </label>
                <div className="profile-wrapper">
                    {
                        personaList && personaList.map(function(persona, idx) {
                            return (
                                <div key={idx}>
                                {
                                    (!persona)
                                    /* 1) persona가 없을 때 */
                                    ? <div className="persona-profile">
                                        <div className="add-persona-btn"
                                            onClick={ goToAddPersona }
                                        ><AiOutlinePlus/></div>
                                    </div>
                                    /* persona가 있을 때 */
                                    : (activePersonaId === persona.id)
                                    /* 2) active persona일 때 */
                                    ? <div
                                    className="persona-profile"
                                    id='active-persona-profile'
                                    style={{backgroundImage: "url('"+ persona.profileImgPath +"')"}}
                                    >
                                        <div className="card-contents">
                                            <div className="card-header">
                                                <div className="card-font persona-name">
                                                    {persona.nickname}
                                                </div>
                                                <div className="card-font persona-job">
                                                    {persona.job}
                                                </div>
                                            </div>
                                            <div className="card-footer">
                                                <div className="sense-wrapper">
                                                    {
                                                        persona.senseIdList && persona.senseIdList.map(function(senseId, idx) {
                                                            return (
                                                                <img 
                                                                key={idx}
                                                                className="sense-icon"
                                                                src={senseIcons[senseId - 1]}
                                                                alt="sense icon"
                                                                ></img>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div 
                                        className="card-hover"
                                        style={{position: "relative", top: "-100%"}}>
                                            <div className="content-wrapper">
                                                <div
                                                className="content-button"
                                                >
                                                    <div className="button-icon"><AiOutlinePlus /></div>
                                                    <div className="button-text">더보기</div>
                                                </div>
                                                <div
                                                className="content-button"
                                                onClick={(e)=>{e.preventDefault(); editPersona(persona.id)}}>
                                                    <div className="button-icon"><MdEdit /></div>
                                                    <div className="button-text">수정하기</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    /* 3) active persona가 아닐 때 */
                                    : <div
                                    className="persona-profile"
                                    style={{backgroundImage: "url('"+ persona.profileImgPath +"')"}}
                                    onClick={(e)=>{e.preventDefault(); changeActivePersona(persona.id)}}
                                    >
                                        <div className="card-hover">
                                            <FaExchangeAlt/>
                                        </div>
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