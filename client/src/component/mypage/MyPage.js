import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaExchangeAlt } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';
import Alert from '../views/Alert';
import '../../assets/css/mypage/mypage.css';
import Idaition from "./Idaition";
import Pinbox from "./Pinbox";
import GNB from "../GNB";
import './MyPage.css';

import eye from '../../asset/images/sense/눈_white.png';
import nose from '../../asset/images/sense/코_white.png';
import mouse from '../../asset/images/sense/입_white.png';
import ears from '../../asset/images/sense/귀_white.png';
import hand from '../../asset/images/sense/손_white.png';

function MyPage() {
    const cookies = new Cookies();
    const navigation = useNavigate();
    var { state } = useLocation();
    
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
    let [EditTrue, setEditTrue] = useState(false);
    let [EditClickTrue, setEditClickTrue] = useState(false);
    let [EditModalClose, setEditModalClose] = useState(false);

    const goToAddPersona = () => {
        navigation('/persona-create'); // persona 생성 페이지로 이동
    }

    useEffect(() => {
        if (state) {
            if (state.alert) {
                var alertInfo = state.alert;
                setAlertTitle(alertInfo.title);
                setAlertSubtitle(alertInfo.subtitle);
                setShowAlert(true);
            }
        }
    }, [])

    useLayoutEffect(() => {   
        for (var i = 0; i < 3; i++) {
            if (personaList[i] && personaList[i].id === activePersonaId) {
                swapActivePersona(i);
            }
        }
    })

    useLayoutEffect(() => {
        // 초기값 설정
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
                    process.env.REACT_APP_SERVER_HOST + '/api/persona/user', {
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

        const getBackgroundImg = async () => {
            const token = cookies.get('token')
            try {
                const res = await axios.get(
                    process.env.REACT_APP_SERVER_HOST+'/api/auth', {
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
            const res = await axios.put(
                process.env.REACT_APP_SERVER_HOST + '/api/persona/user/' + personaId, {},
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
            //navigation('/mypage')
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
    }


    const goToMyPersona = (personaId) => {
        navigation('/mypersona/view', { state: { personaId: personaId, personaIdList: personaIdList } })
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
                    process.env.REACT_APP_SERVER_HOST+'/api/mypage/image', formData, {
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
        <div className="background-img2" style={{ width: '100%', height: '100%' }}>
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
                                        onClick={(e)=>{e.preventDefault(); goToMyPersona(persona.id)}}
                                        style={{position: "relative", top: "-100%"}}>
                                            <div className="content-wrapper">
                                                <div className="content-button">
                                                    <div className="button-icon"><AiOutlinePlus /></div>
                                                    <div className="button-text">더보기</div>
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