import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import Form01 from './createform/Form01';
import Form02 from './createform/Form02';
import Form03 from './createform/Form03';
import Form04 from './createform/Form04';
import Form05 from './createform/Form05';
import Alert from '../views/Alert';

function Create() {
    const cookies = new Cookies();
    const navigation = new useNavigate();
    const dispatch = useDispatch();
    const pageList = [ 1, 2, 3, 4, 5 ]

    let [showAlert, setShowAlert] = useState(false);
    let [alertTitle, setAlertTitle] = useState("");
    let [alertSubtitle, setAlertSubtitle] = useState("");

    let [formPage, setFormPage] = useState(1)
    let [formData, setFormData] = useState(null)
    let [profileUrl, setProfileUrl] = useState("")
    let [photo, setPhoto] = useState("")
    let [nickname, setNickName] = useState("")
    let [gender, setGender] = useState(false)
    let [age, setAge] = useState(null)
    let [charmList, setCharmList] = useState([])
    let [interestIdList, setInterestIdList] = useState([])
    let [senseIdList, setSenseIdList] = useState([])
    let [mbti, setMbti] = useState("")
    let [job, setJob] = useState("")
    let [newCharmList, setNewCharmList] = useState(["","","",""])
    let [introduction, setIntroduction] = useState("")
    let [isFirstPersona, setIsFirstPersona] = useState(false)


    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const nextPage = () => {
        window.scrollTo(0,0)
        setFormPage(formPage + 1);
    }

    const postPersona = async () => {
        var token = localStorage.getItem('token');
        try {
            const res = await axios.post(
                process.env.REACT_APP_SERVER_HOST+'/api/persona', 
                {
                    nickname: nickname,
                    age: age,
                    gender: gender,
                    mbti: mbti,
                    charmList: charmList,
                    job: job,
                    senseIdList: senseIdList,
                    interestIdList: interestIdList,
                    introduction: introduction
                  }, {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                  }
            )
            const personaId = res.data

            // ????????? ????????? ??????
            postProfileImg(personaId)

        } catch (err) {
            setShowAlert(true);
            setAlertTitle("???????????? ????????? ??????????????????.")
            setAlertSubtitle("?????? ??????????????????")
            console.log(err);
        }
    }

    const postProfileImg = async (personaId) => { // ????????? ????????? ??????
        if (formData) { // ???????????? ???????????????
            var token = localStorage.getItem('token');
            try {
                await axios.post(
                    process.env.REACT_APP_SERVER_HOST+'/api/persona/image/' + personaId, formData, 
                    {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )
            } catch (err) {
                setShowAlert(true);
                setAlertTitle("????????? ????????? ??????????????????.")
                setAlertSubtitle("?????? ??????????????????")
                console.log(err);
            }
        }
        
        // ?????? ????????????
        if (isFirstPersona) {
            firstPersonaAction(personaId);                
        } 
        // ?????? ????????? ????????????
        else {
            navigation('/mypage', { 
                state: { alert: {title: "???????????? ????????? ??????????????????", subtitle: "????????? ??????????????????!"}}
            })              
        }
    }

    const firstPersonaAction = async (personaId) => {
        const token = localStorage.getItem('token');
        try {
            // Active persona??? ????????? ??????????????? ????????????
            await axios.put(
                process.env.REACT_APP_SERVER_HOST+'/api/persona/user/' + personaId, {},
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            )
            navigation('/landing', { state: {personaCreate: true}, replace: true }) // landing ???????????? ??????
            dispatch({type: 'CHANGEPERSONA', data: personaId}) // persona ????????? ??????
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(()=> { // ?????? ???????????? ??????
        const getPersonaLength = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(
                    process.env.REACT_APP_SERVER_HOST+'/api/persona', {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                // ?????? ??????????????? ??????
                if (res.data.length === 0) {
                    setIsFirstPersona(true)
                } else {
                    setIsFirstPersona(false)
                }
            } catch (err) {
                console.log(err);
            }
        }

        getPersonaLength();
    
    }, [])

    return (
        <form className="form-wrapper" onSubmit={ handleSubmit }>
            <Alert alertTitle={alertTitle} alertSubtitle={alertSubtitle} showAlert={showAlert} setShowAlert={setShowAlert}/>
            <div className="title" style={{ marginBottom: '48px' }}>
                ???????????? ??????
            </div>
            <div style={{width:'100%'}}>
                    <div className="page-wrapper">
                    {
                        pageList.map(function(page, idx) {
                            return (
                                <div
                                key={idx}
                                className="page-elem"
                                style={{ backgroundColor: formPage===page && "#FE6740"}}
                                onClick={ ()=>{ setFormPage(page) } }
                                >
                                    { page }
                                </div>
                            )
                        })
                    }
                    </div>

                { formPage===1 &&  <Form01 formData={formData} setFormData={setFormData} profileUrl={profileUrl} setProfileUrl={setProfileUrl}  setPhoto={setPhoto} nickname={nickname} setNickName={setNickName} job={job} setJob={setJob} age={age} setAge={setAge} gender={gender} setGender={setGender} nextPage={nextPage}></Form01> }
                { formPage===2 &&  <Form02 interestIdList={interestIdList} setInterestIdList={setInterestIdList} nextPage={nextPage}></Form02> }
                { formPage===3 &&  <Form03 nickname={nickname} charmList={charmList} setCharmList={setCharmList} newCharmList={newCharmList} setNewCharmList={setNewCharmList} mbti={mbti} setMbti={setMbti} nextPage={nextPage}></Form03> }
                { formPage===4 &&  <Form04 senseIdList={senseIdList} setSenseIdList={setSenseIdList} nextPage={nextPage}></Form04> }
                { formPage===5 &&  <Form05 introduction={introduction} setIntroduction={setIntroduction} postPersona={postPersona}></Form05> }
            </div>


        </form>
    );
}

export default Create;