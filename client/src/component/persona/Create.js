import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import Form01 from './createform/Form01';
import Form02 from './createform/Form02';
import Form03 from './createform/Form03';
import Form04 from './createform/Form04';

function Create() {
    const cookies = new Cookies();
    const pageList = [ 1, 2, 3, 4 ]

    let [formPage, setFormPage] = useState(1)
    let [photo, setPhoto] = useState("")
    let [nickname, setNickName] = useState("")
    let [gender, setGender] = useState(1)
    let [age, setAge] = useState()
    let [charmList, setCharmList] = useState([])
    let [interestIdList, setInterestIdList] = useState([])
    let [senseIdList, setSenseIdList] = useState([])
    let [mbti, setMbti] = useState("")
    let [job, setJob] = useState("")
    let [newCharmList, setNewCharmList] = useState([])

    let [postSuccess, setPostSuccess] = useState(false)


    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const nextPage = () => {
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
                페르소나 등록
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

                { formPage===1 &&  <Form01 setPhoto={setPhoto} nickname={nickname} setNickName={setNickName} job={job} setJob={setJob} age={age} setAge={setAge} gender={gender} setGender={setGender} nextPage={nextPage}></Form01> }
                { formPage===2 &&  <Form02 interestIdList={interestIdList} setInterestIdList={setInterestIdList} nextPage={nextPage}></Form02> }
                { formPage===3 &&  <Form03 nickname={nickname} charmList={charmList} setCharmList={setCharmList} newCharmList={newCharmList} setNewCharmList={setNewCharmList} mbti={mbti} setMbti={setMbti} nextPage={nextPage}></Form03> }
                { formPage===4 &&  <Form04 senseIdList={senseIdList} setSenseIdList={setSenseIdList} nextPage={nextPage}></Form04> }
                </div>
                : null
            }


        </form>
    );
}

export default Create;