import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import Form01 from './createform/Form01';
import Form02 from './createform/Form02';
import Form03 from './createform/Form03';
import Form04 from './createform/Form04';
import Form05 from './createform/Form05';

function Create() {
    const cookies = new Cookies();
    const navigation = new useNavigate();
    const pageList = [ 1, 2, 3, 4, 5 ]

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
        setFormPage(formPage + 1);
    }

    const postPersona = async () => {
        var token = cookies.get('token');
        try {
            const res = await axios.post(
                'http://52.78.105.195/api/persona', 
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

            // 이미지가 있으면 이미지도 등록함
            if (formData != null) {
                postProfileImg(personaId)
            }

            // 신규 유저라면
            if (isFirstPersona) {
                changeActivePersona(personaId);
                navigation('/landing', { state: {personaCreate: true}, replace: true })
            } 
            // 신규 유저가 아니라면
            else {
                navigation('/mypage', { state: {alert:{title: "페르소나 생성을 완료했습니다", subtitle: "활동을 시작해보세요!"}}})              
            }
            

        } catch (err) {
            alert("페르소나 등록에 실패했습니다.")
            console.log(err);
        }
    }

    const postProfileImg = async (personaId) => {
        var token = cookies.get('token');
        try {
            await axios.post(
                'http://52.78.105.195/api/persona/image/' + personaId, formData, 
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            )
        } catch (err) {
            alert("이미지 등록에 실패했습니다.")
            console.log(err);
        }
    }

    const changeActivePersona = async (personaId) => {
        const token = cookies.get('token');
        try {
            await axios.put(
                'http://52.78.105.195/api/persona/user/' + personaId, {},
                {
                    headers: {
                        Authorizaation: "Bearer " + token
                    }
                }
            )
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(()=> { // 신규 유저인지 파악
        const getPersonaLength = async (token) => {
            try {
                const res = await axios.get(
                    'http://52.78.105.195/api/persona', {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                // 신규 페르소나인 경우
                if (res.data.length < 1) {
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
            <div className="title" style={{ marginBottom: '48px' }}>
                페르소나 등록
            </div>
            <div style={{width:'100%'}}>
                    <div className="page-wrapper">
                    {
                        pageList.map(function(page) {
                            return (
                                <div
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