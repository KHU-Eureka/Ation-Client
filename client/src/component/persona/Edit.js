import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie'

function Create() {
    const cookies = new Cookies(); 

    let [formPage, setFormPage] = useState(1)
    let [photo, setPhoto] = useState("")
    let [nickname, setNickName] = useState("")
    let [gender, setGender] = useState("")
    let [age, setAge] = useState(0)
    let [charmList, setCharmList] = useState([])
    let [interestIdList, setInterestIdList] = useState([])
    let [senseIdList, setSenseIdList] = useState([])
    let [mbti, setMbti] = useState("")
    let [job, setJob] = useState("")

    let [postSuccess, setPostSuccess] = useState(false)

    const getInterestList = async () => {
        try {
            const res = await axios.get(
                'http://163.180.117.22:7218/api/persona-category/interest'
            )
            interestList = res.data
            console.log(interestList)
        } catch (err) {
            console.log(err)
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const nextPage = () => {
        console.log(formPage);
        setFormPage(formPage + 1);
    }

    const postPersona = async () => {
        var token = cookies.get('token');
        setPostSuccess(true);
        try {
            const res = await axios.post(
                'http://163.180.117.22:7218/api/persona', 
                {
                    nickname: nickname,
                    age: age,
                    gender: gender,
                    mbti: mbti,
                    charmList: [
                      "string"
                    ],
                    job: job,
                    senseIdList: [
                        0
                    ],
                    interestIdList: [
                      0
                    ],
                    headers: {
                        Authorization: "Bearer " + token
                    }
                  }
            )
            setPostSuccess(true);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <form className="form-wrapper" onSubmit={ handleSubmit }>
            <div className="title" style={{ marginBottom: '48px' }}>
                페르소나 수정
            </div>
            {
                postSuccess === false
                ?  <div style={{width:'100%'}}>
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

                { formPage===1 &&  <Form01 setPhoto={setPhoto} setNickName={setNickName} setJob={setJob} setAge={setAge} setGender={setGender} nextPage={nextPage}></Form01> }
                { formPage===2 &&  <Form02 interestList={interestList} setInterestIdList={setInterestIdList} nextPage={nextPage}></Form02> }
                { formPage===3 &&  <Form03 charmNameList={charmNameList} setCharmList={setCharmList} setMbti={setMbti} nextPage={nextPage}></Form03> }
                { formPage===4 &&  <Form04 senseList={senseList} setSenseIdList={setSenseIdList} nextPage={nextPage}></Form04> }
                </div>
                : null
            }


        </form>
    );
}

export default Create;