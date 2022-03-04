import React, { useState } from 'react';
import axios from 'axios';
import SelectBox from '../../views/input/SelectBox';
import SelectBox2 from '../../views/input/SelectBox2';
import { Cookies } from 'react-cookie';
import { MdCloudUpload } from 'react-icons/md';
// import { AiFillCaretDown } from 'react-icons/ai';
// import { BsCheck2 } from 'react-icons/bs';

function Form01(props) {
    const cookies = new Cookies();
    const ageList = [...Array(84)].map((v,i) => i+17);
    const genderList = [{id: 1, value: "여"}, {id: 2, value: "남"}]

    let [nickNameValidation, setNickNameValidation] = useState(false);
    let [nickNameMsg, setNickNameMsg] = useState("");
    let [tempNickName, setTempNickName] = useState(props.nickname);

    const readImage = (input) => {
        // file이 존재하는 경우
        if (input.files && input.files[0]) {
            const reader = new FileReader()
            reader.onload = e => {
                props.setProfileUrl(e.target.result)
            }
            reader.readAsDataURL(input.files[0])
        }
    }

    const onChangeImg = (e) => {
        e.preventDefault();
        if (e.target.files) {
            const uploadFile = e.target.files[0]
            const formData = new FormData()
            formData.append('profileImg', uploadFile)
            props.setFormData(formData)
        }
    }

    const NickNameChange = (e) => {
        props.setNickName("")
        setTempNickName(e.target.value)
        setNickNameValidation(false)
        setNickNameMsg("닉네임 중복 검사를 해주세요")
    }


    const validationCheck = async () => {
        var token = localStorage.getItem('token');
        const temp = tempNickName;
        try {
            const res = await axios.get(
                process.env.REACT_APP_SERVER_HOST+'/api/persona/duplicate?nickname=' + temp, {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            )
            const duplicate = res.data;
            setNickNameValidation(!duplicate); 
            if (duplicate) {
                setNickNameMsg("이미 사용중인 닉네임입니다.");
            } else {
                setNickNameMsg("사용 가능한 닉네임입니다.");
                props.setNickName(tempNickName);
            }       
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <div className="persona-create-page">
            <div className="input-wrapper">
                <label htmlFor="profile">
                    프로필 사진
                </label>
                    <input
                        id="profile-photo"
                        className="profile-photo-input"
                        type="file"
                        style={{ display: 'none'}}
                        onChange={ (e)=>{ readImage(e.target); onChangeImg(e); } }
                    />
                    <div id="profile-photo-preview" style={{backgroundImage: 'url('+props.profileUrl+')'}}>
                    <label htmlFor="profile-photo" id="profile-photo-label">
                        <MdCloudUpload />
                    </label> 
                    </div>            

            </div>

            <div className="input-wrapper">
                <label htmlFor="nickname">
                    닉네임
                </label>
                <div style={{width:'100%', display: 'flex', alignItems: 'baseline'}}>
                <div className="nickname-wrapper">
                    <input
                        style={{width: '300px'}}
                        id="nickname"
                        type="text"
                        maxLength="10"
                        placeholder="활동할 페르소나의 닉네임을 입력해주세요."
                        onChange={ NickNameChange }
                        value={ tempNickName }
                    />
                    <div
                     style={{ color: (nickNameValidation ? '#0075FF' : '#F24822') }}
                     className="alert-msg nickname">{ nickNameMsg }
                     </div>
                </div>
                <button className="check-validation-btn"
                onClick={ validationCheck }>
                    중복 확인
                </button>
                </div>
            </div>

            <div className="input-wrapper">
                <label htmlFor="job">
                    현재 직업
                </label>
                <input
                    style={{width: '300px'}}
                    id="job"
                    type="text"
                    maxLength="10"
                    placeholder="현재 직업을 입력해주세요."
                    onChange={ (e)=>{ props.setJob(e.target.value) } }
                    value={ props.job }
                />
            </div>

            <div className="input-wrapper">
                <label htmlFor="age">
                    나이
                </label>
                <SelectBox selectedValue={props.age} setValue={props.setAge} optionList={ageList} defaultValue={"나이를 선택하세요."}></SelectBox>
            </div>

            <div className="input-wrapper">
                <label htmlFor="gender">
                    성별
                </label>
                <SelectBox2 selectedValue={props.gender} setValue={props.setGender} optionList={genderList} defaultValue={"성별을 선택하세요."}></SelectBox2>
            </div>

            <button
            className="small-btn"
            onClick={()=>{props.nextPage()}}
            disabled={ props.nickname==="" || props.job==="" || props.age===null || props.gender===false }>
                다음
            </button>
        </div>
    );
}

export default Form01;