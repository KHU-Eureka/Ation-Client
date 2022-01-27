import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SelectBox from '../views/input/SelectBox';
import SelectBox2 from '../views/input/SelectBox2';
import { MdEdit } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';

import Alert from '../views/Alert';

import eye_white from '../../asset/images/sense/눈_white.png';
import eye_color from '../../asset/images/sense/눈_color.png';
import nose_white from '../../asset/images/sense/코_white.png';
import nose_color from '../../asset/images/sense/코_color.png';
import mouse_white from '../../asset/images/sense/입_white.png';
import mouse_color from '../../asset/images/sense/입_color.png';
import ears_white from '../../asset/images/sense/귀_white.png';
import ears_color from '../../asset/images/sense/귀_color.png';
import hand_white from '../../asset/images/sense/손_white.png';
import hand_color from '../../asset/images/sense/손_color.png';

import './MyPersona.css';

function MyPersona ({match}) {
    const cookies = new Cookies();
    const navigation = useNavigate();
    const { state } = useLocation();
    const { mode } = useParams();
    let dispatch = useDispatch();

    // alert 관련
    let [showAlert, setShowAlert] = useState(false);
    let [alertTitle, setAlertTitle] = useState("");
    let [alertSubtitle, setAlertSubtitle] = useState("");

    const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/;
    const ageList = [...Array(100)].map((v,i) => i+1);
    const genderList = [{id: 1, value: "여"}, {id: 2, value: "남"}]
    const MBTIList = ["ISTJ", "ISFJ", "INFJ",
    "INTJ", "ISTP", "ISFP",
    "INFP", "INTP", "ESTP",
    "ESFP", "ENFP", "ENTP",
    "ESTJ", "ESFJ", "ENFJ",
    "ENTJ"]
    const senseInfoList = [
        { senseId: 1, name: "눈", width: '120px', whiteImg: eye_white, colorImg: eye_color, description: "세상의 흐름을 통찰력 있게 바라볼 수 있는 능력을 의미합니다." },
        { senseId: 2, name: "코", width: '120px', whiteImg: nose_white, colorImg: nose_color, description: "센스있게 핵심 포인트를 잘 짚는 능력을 의미합니다." },
        { senseId: 3, name: "입", width: '120px', whiteImg: mouse_white, colorImg: mouse_color, description: "주도적으로 대화하고, 소통을 잘하는 능력을 의미합니다." },
        { senseId: 4, name: "귀", width: '190px', whiteImg: ears_white, colorImg: ears_color, description: "타인의 이야기를 경청할 수 있는 능력을 의미합니다." },
        { senseId: 5, name: "손", width: '190px', whiteImg: hand_white, colorImg: hand_color, description: "이야기, 정보들을 정리하고 시각화하는 능력을 의미합니다." },
    ]
    const charmNumberAlert = "최대 3개까지 선택 가능합니다.";
    const chamKoreanAlert = "6자리 이하의 한글만 입력 가능합니다.";

    let [backgroundImgUrl, setBackgroundImgUrl] = useState("")

    let [personaInfo, setPersonaInfo] = useState({});
    let [senseList, setSenseList] = useState([]);
    let [interestList, setInterestList] = useState([]);

    // state에서 받아온 정보들
    let [personaId, setPersonaId] = useState(null)
    let [personaIdList, setPersonaIdList] = useState([])

    let [formData, setFormData] = useState(null)
    let [nickname, setNickName] = useState("")
    let [gender, setGender] = useState(1)
    let [age, setAge] = useState(0)
    let [charmList, setCharmList] = useState([])
    let [pastCharmList, setPastCharmList] = useState([])
    let [interestIdList, setInterestIdList] = useState([])
    let [senseIdList, setSenseIdList] = useState([])
    let [mbti, setMbti] = useState("")
    let [job, setJob] = useState("")
    let [introduction, setIntroduction] = useState("");

    let [profileUrl, setProfileUrl] = useState("dd")
    let [nickNameValidation, setNickNameValidation] = useState(true);
    let [nickNameMsg, setNickNameMsg] = useState("");
    let [tempNickName, setTempNickName] = useState("");
    let [currSense, setCurrSense] = useState(null);
    let [senseColorInfo, setSenseColorInfo] = useState([true, true, true, true, true]); // sense icon의 현재 색상 유무를 나타내는 lsit

    let [charmAlertMsg, setCharmAlertMsg] = useState("");
    let [showInterestAlertMsg, setShowInterestAlertMsg] = useState(false);
    let [showCharmAlertMsg, setShowCharmAlertMsg] = useState(false);
    let [showSenseAlertMsg, setShowSenseAlertMsg] = useState(false);

    useLayoutEffect(() => {
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
    }, [])

    const readImage = (input) => {
        // file이 존재하는 경우
        if (input.files && input.files[0]) {
            const reader = new FileReader()
            reader.onload = e => {
                setProfileUrl(e.target.result)
            }
            reader.readAsDataURL(input.files[0])
        }
    }

    const onChangeImg = (e) => {
        e.preventDefault();
        if (e.target.files) {
            const uploadFile = e.target.files[0]
            const tempFormData = new FormData()
            tempFormData.append('profileImg', uploadFile)
            setFormData(tempFormData)
        }
    }

    const NickNameChange = (e) => {
        setTempNickName(e.target.value)
        setNickNameValidation(false)
        setNickNameMsg("닉네임 중복 검사를 해주세요")
    }

    // 닉네임의 중복성을 검사함
    const nicknameValidationCheck = async () => {
        var token = cookies.get('token');
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
            }       
        } catch (err) {
            console.log(err);
        }
    }

    const interestChangeHandler = (checked, id) => {
        if (checked) {
            if(interestIdList.length === 3) {
                setShowInterestAlertMsg(true)
            } else {
                setInterestIdList([...interestIdList, id])
            }
            
        } else {
            setShowInterestAlertMsg(false)
            setInterestIdList(interestIdList.filter((el) => el !== id))
        }
    }

    let [newCharm1, setNewCharm1] = useState("");
    let [newCharm2, setNewCharm2] = useState("");
    let [newCharm3, setNewCharm3] = useState("");
    let [newCharmList, setNewCharmList] = useState(["","","",""])

    const charmChangeHandler = (checked, charm, newCharmIdx=false) => {
        var tempList = [...newCharmList];
        if (charm && checked) {
            if(charmList.length === 3) {
                setCharmAlertMsg(charmNumberAlert)
                setShowCharmAlertMsg(true)
            } else {
                setCharmList([...charmList, charm])
                if (newCharmIdx) {
                    tempList[newCharmIdx] = charm
                    setNewCharmList(tempList)
                }
            }
        } else {
            setCharmList(charmList.filter((el) => el !== charm))
            setPastCharmList(pastCharmList.filter((el) => el !== charm))
            if (newCharmIdx) {
                tempList[newCharmIdx] = ""
                setNewCharmList(tempList)
            }
            setShowCharmAlertMsg(false)
        }
        console.log(charmList);
    }

    const isKorean = (text) => { // 한국어인지 test하는 함수
        setShowCharmAlertMsg(false)
        for(var c = 0; c < text.length; c++) {
            if (!korean.test(text[c])) {
                setCharmAlertMsg(chamKoreanAlert);
                setShowCharmAlertMsg(true);
                return false;
            }
        }
        return (text.length < 7)
    }

    const senseChangeHandler = (checked, senseId) => {
        if (checked) {
            if (senseIdList.length === 2) {
                setShowSenseAlertMsg(true)
            } else {
                setSenseIdList([...senseIdList, senseId])   
                reverseIconColor(senseId - 1, true)   
            }      
        } else {
            setSenseIdList(senseIdList.filter((el) => el !== senseId))
            reverseIconColor(senseId - 1, false)
            setShowSenseAlertMsg(false)
        }
    }

    const reverseIconColor = (idx, hoverOrChecked) => {
        var tempList = JSON.parse(JSON.stringify(senseColorInfo))
        tempList[idx] = !hoverOrChecked
        setSenseColorInfo(tempList)
    }

    const onSenseMouseEnter = (sense) => { // hover event가 일어날 때
        setCurrSense(sense) // 현재 sense의 설명을 띄움
        if (!senseIdList.includes(sense.senseId)) {
            reverseIconColor(sense.senseId - 1, true) // 아이콘을 흰색으로 띄워야 함
        }
    }

    const onSenseMouseLeave = (sense) => { // hover event에서 벗어날 때
        setCurrSense(null) // 현재 sense 정보를 초기화
        if (!senseIdList.includes(sense.senseId)) {
            reverseIconColor(sense.senseId - 1, false) // 아이콘을 색상으로 띄워야 함
        }
    }

        // 초기 선택된 sense의 icon color를 흰색으로 바꿈
        useEffect( () => {
            var temp = JSON.parse(JSON.stringify(senseColorInfo))
            for(var i = 0; i < senseIdList.length; i++) {
                temp[senseIdList[i] - 1] = false;
            }
            setSenseColorInfo(temp)
        }, [senseIdList])
    
        useEffect(() => {
            setNewCharm1(newCharmList[1]);
            setNewCharm2(newCharmList[2]);
            setNewCharm3(newCharmList[3]);
    
            const getInterestList = async () => {
                try {
                    const res = await axios.get(
                        process.env.REACT_APP_SERVER_HOST+'/api/persona-category/interest'
                    )
                    var temp = res.data;
                    setInterestList(temp);
                } catch (err) {
                    console.log(err)
                }
            }
            getInterestList();
    
            const getSenseList = async () => {
                try {
                    const res = await axios.get(
                        process.env.REACT_APP_SERVER_HOST+'/api/persona-category/sense'
                    )
                    var temp = res.data;
                    setSenseList(temp);
                } catch (err) {
                    console.log(err)
                }
            }
            getSenseList();
        }, [])
    
        useEffect( () => {
            // 초기값 설정
            if (state != null) {
                if (state.personaId != null) {
                    const currPersonaId = state.personaId;
                    setPersonaId(currPersonaId);
                }
                if (state.personaIdList != null) {
                    console.log(personaIdList)
                    const getPersonaIdList = state.personaIdList;
                    setPersonaIdList(getPersonaIdList);
                }
            }
    
            if (personaId != null) {
                // persona  정보를 받아옴
                const getPersona = async () => {
                    const token = cookies.get('token');
                    try {
                        const res = await axios.get(
                            process.env.REACT_APP_SERVER_HOST+'/api/persona/' + personaId, {
                                headers: {
                                    Authorization: 'Bearer ' + token
                                }
                            }
                        )
                        const info = res.data
                        setPersonaInfo(info)
    
                        if (info != null) {
                            setNickName(info.nickname);
                            setTempNickName(info.nickname);
                            setAge(info.age);
                            setGender(info.gender);
                            setMbti(info.mbti);
                            setJob(info.job);
                            setPastCharmList(info.charmList);
                            setCharmList(info.charmList);
                            setProfileUrl(info.profileImgPath);
                            setInterestIdList(info.interestIdList);
                            setSenseIdList(info.senseIdList);
                            setIntroduction(info.introduction);
                        }
                    } catch (err) {
                        alert("fail")
                        console.log(err);
                    }
                }
                getPersona();
            }
    
        }, [personaId])

        const validationCheck = () => {
            if (tempNickName!==nickname && !nickNameValidation) { // 닉네임이 변경되었고, 유효성 검사를 하지 않았다면,
                setAlertTitle("닉네임 중복 검사를 해주세요.")
                setAlertSubtitle("닉네임 중복 검사는 필수입니다.")
                setShowAlert(true)
                window.scrollTo(0, 500);
                return;
            } else if (!job.length) {
                setAlertTitle("직업을 작성해주세요.")
                setAlertSubtitle("직업 란이 누락되었어요")
                setShowAlert(true)
                window.scrollTo(0, 500);
                return;
            } else if(!interestIdList.length) {
                setAlertTitle("분야 태그를 선택해주세요.")
                setAlertSubtitle("분야 태그는 한개 이상 존재해야 합니다.")
                setShowAlert(true)
                window.scrollTo(0, 870);
                return;
            } else if (!charmList.length) {
                setAlertTitle("매력 태그를 입력해주세요.")
                setAlertSubtitle("매력 태그는 한개 이상 존재해야 합니다.")
                setShowAlert(true)
                window.scrollTo(0, 1220);
                return;
            } else if (!senseIdList.length) {
                setAlertTitle("감각 태그를 선택해주세요.")
                setAlertSubtitle("감각 태그는 한개 이상 존재해야 합니다.")
                setShowAlert(true)
                window.scrollTo(0, 1520);
                return;
            }
            editPersona();
        }
    
        const editPersona = async () => {
            const token = cookies.get('token');
            try {
                await axios.put(
                    process.env.REACT_APP_SERVER_HOST+'/api/persona/'+personaId, 
                    {
                        nickname: tempNickName,
                        age: age,
                        gender: gender,
                        mbti: mbti,
                        charmList: charmList,
                        job: job,
                        senseIdList: senseIdList,
                        interestIdList: interestIdList,
                        introduction: introduction,
                    }, {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    }
                )
                if (formData) {
                    postProfileImg();
                }
    
                window.scrollTo(0,0)
    
                // 마이페이지로 이동
                navigation('/mypage', { state: {alert:{title: "페르소나 수정을 완료했습니다", subtitle: "", show: true}}})
            } catch (err) {
                console.log(err)
            }
        }
    
        const postProfileImg = async () => {
            var token = cookies.get('token');
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
                console.log(err);
            }
        }
    
        const changeActivePersona = async (personaId) => {
            const token = cookies.get('token')
            try {
                await axios.put(
                    process.env.REACT_APP_SERVER_HOST+'/api/persona/user/' + personaId, {},
                    {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )
                dispatch({type: 'CHANGEPERSONA', data: personaId});
            } catch (err) {
                console.log(err)
            }
        }
    
        const deletePersona = async () => {
            const token = cookies.get('token')
            try {
                await axios.delete(
                    process.env.REACT_APP_SERVER_HOST+'/api/persona/'+personaId, {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    }
                )
                // 마이페이지로 이동
                navigation('/mypage', { state: {alert:{title: "페르소나를 삭제했습니다", subtitle: ""}}})  
                window.scrollTo(0,0)
            } catch(err) {
                console.log(err)
            }
        }
    
        const deleteAction = () => {
            for(var changeId of personaIdList) {
                if (changeId !== personaId) {
                    changeActivePersona(changeId)
                    deletePersona()
                    break;
                }
            }
        }

        const goToEditPersona = () => {
            window.scrollTo(0,320)
            navigation('/mypersona/edit', { state: { personaId: personaId, personaIdList: personaIdList } })
        }
    

    return (
        <div className="mypersona">
            <Alert alertTitle={alertTitle} alertSubtitle={alertSubtitle} showAlert={showAlert} setShowAlert={setShowAlert}/>
            <div 
            className="background-img"
            style={{backgroundImage: "url('"+backgroundImgUrl+"')"}}
            ></div>
            <div className="content">
            <div className="title">내 페르소나</div>
            <div className="flex-row">
                <div className="profile flex-column">
                    <label>페르소나 프로필</label>
                    <input
                            id="profile-photo"
                            className="profile-photo-input"
                            type="file"
                            style={{ display: 'none'}}
                            onChange={ (e)=>{ readImage(e.target); onChangeImg(e); } }
                            disabled={mode==="view"}
                        />
                        <div id="profile-photo-preview"
                        style={{backgroundImage: 'url('+profileUrl+')'}}>
                            {
                                mode === "view"
                                ? null
                                : <label htmlFor="profile-photo" id="profile-photo-label">
                                    <MdEdit />
                                </label> 
                            }
                        </div> 
                </div>
                <div className="inputs flex-column">

                    <div className="input-wrapper nickname-wrapper">
                        <label>닉네임</label>
                        <input
                        id="nickname"
                        type="text"
                        placeholder="활동할 페르소나의 닉네임을 입력해주세요."
                        onChange={ NickNameChange }
                        value={ tempNickName }
                        disabled={ mode==="view" }
                        />
                        {
                            /* 닉네임이 바뀐 경우 */
                            (tempNickName !== nickname) &&
                            <button className="check-validation-btn"
                            onClick={ nicknameValidationCheck }>
                                중복 확인
                            </button>
                        }
                        {
                            (tempNickName !== nickname) &&
                            <div
                                style={{ color: (nickNameValidation ? '#0075FF' : '#F24822') }}
                                className="alert-msg">{ nickNameMsg }
                            </div>
                        }
                    </div>

                    <div className="input-wrapper">
                        <label>직업</label>
                        <input
                        id="job"
                        type="text"
                        placeholder="현재 직업을 입력해주세요."
                        onChange={ (e)=>{ setJob(e.target.value) } }
                        value={ job }
                        disabled={mode==="view"}
                        />
                    </div>
                    <div className="input-wrapper2" style={{marginBottom: '60px'}}>
                        <div className="input-wrapper" style={{marginRight: '50px'}}>
                            <label>나이</label>
                            {
                                mode === "view"
                                ? <div>{ age }</div>
                                : <SelectBox selectedValue={age} setValue={setAge} optionList={ageList} defaultValue={"나이를 선택하세요."}></SelectBox>
                            }
                        </div>

                        <div className="input-wrapper">
                            <label>성별</label>
                            {
                                mode === "view"
                                ? <div>{ genderList.filter(elem => elem.id === gender)[0].value }</div>
                                : <SelectBox2 selectedValue={gender} setValue={setGender} optionList={genderList} defaultValue={"성별을 선택하세요."}></SelectBox2>
                            }
                        </div>
                    </div>
                    <div className="input-wrapper2">
                        <label>분야태그</label>
                        <div className="edit-form-input-box">
                        <div className="checkbox-wrapper">
                                <div
                                className="alert-msg-wrapper"
                                style={showInterestAlertMsg ? {opacity: 1} : {opacity: 0}}>
                                    {showInterestAlertMsg &&
                                    <div className="alert-msg bounce">
                                        최대 3개까지 선택 가능합니다.
                                    </div>}
                                </div>
                                    {
                                        [...interestList].map( function(interest, idx) {
                                            return(
                                                (mode==="edit" || interestIdList.includes(interest.interestId))
                                                && <div className="checkbox-elem" key={idx}>
                                                    <input
                                                        id={ interest.interestId }
                                                        value={ interest.interestId }
                                                        name="interest"
                                                        type="checkbox"
                                                        checked={interestIdList.includes(interest.interestId) ? true : false}
                                                        onChange={ (e)=>{ interestChangeHandler(e.currentTarget.checked, interest.interestId) } }
                                                        disabled={mode==="view"}
                                                    />
                                                    <label htmlFor={ interest.interestId }>{ interest.name }</label>
                                                </div>
                                                
                                            )
                                        } )
                                    }
                        </div>
                        </div>
                    </div>

                    <div className="input-wrapper2">
                        <label>매력태그</label>
                        <div className="edit-form-input-box">
                        <div className="checkbox-wrapper">
                        <div
                        className="alert-msg-wrapper"
                        style={showCharmAlertMsg ? {opacity: 1} : {opacity: 0}}>
                            {showCharmAlertMsg &&
                            <div className="alert-msg bounce">
                                { charmAlertMsg }
                            </div>}
                        </div>
                            {
                                pastCharmList && pastCharmList.map(function(charm, idx) {
                                    return (
                                    charmList.includes(charm)
                                    && <div className="checkbox-elem" key={ idx }>
                                        <input
                                            id={ charm }
                                            value={ charm }
                                            name="charm"
                                            type="checkbox"
                                            style={{pointerEvents: 'none'}}
                                            checked={charmList.includes(charm) ? true : false}
                                            onChange={ (e)=>{ charmChangeHandler(e.currentTarget.checked, charm) }}
                                            disabled={mode==="view"}
                                        />
                                        { mode==="edit" &&
                                        <label className="charm-label" htmlFor={ charm }>
                                            <div className="delete-btn"><IoClose/></div>
                                        </label>
                                        }
                                        {/* charm value를 보여줌 */}
                                        <div className="charm-text">{ charm }</div>
                                    </div>
                                    )
                                } )
                            }

                            {/*
                                newCharmList.map((charm, idx) => (
                                    (idx < 3 - charmList.length) && 
                                    <div className="checkbox-elem" key={idx}>
                                        <input
                                            id={ "newcharm" + idx }
                                            value={charm}
                                            name="charm"
                                            type="checkbox"
                                            checked={charmList.includes(charm)}
                                            onChange={ (e)=>{ charmChangeHandler(false, charm) } }
                                        />
                                        <label htmlFor="new-charm1" className="center">
                                            <textarea 
                                                className="new-tag-input"
                                                rows="1"
                                                placeholder="직접 태그를 &#10;입력해보세요!"
                                                value={newCharm1}
                                                onChange={ (e)=>{ charmChangeHandler(false, e.target.value) } }
                                            />
                                        </label>
                                    </div>
                                ))
                                */}

                            { (mode==="edit" && pastCharmList.length < 3) &&
                            <div className="checkbox-elem">
                                <input
                                    id="new-charm1"
                                    name="charm"
                                    type="checkbox"
                                    checked={charmList.includes(newCharm1)}
                                    onChange={ (e)=>{ charmChangeHandler(e.currentTarget.checked, newCharm1, 1) } }
                                    disabled={newCharm1===""}
                                />
                                <label htmlFor="new-charm1" className="center">
                                    <textarea 
                                        className="new-tag-input"
                                        rows="1"
                                        placeholder="직접 태그를 &#10;입력해보세요!"
                                        value={newCharm1}
                                        onChange={ (e)=>{ 
                                            charmChangeHandler(false, newCharm1, 1); // 기존 값을 charmList에서 삭제
                                            isKorean(e.target.value) && setNewCharm1(e.target.value) // 한글일 때에만 변경 
                                        }}
                                    />
                                </label>
                            </div> }

                            
                            { (mode==="edit" && pastCharmList.length < 2)
                            ? <div className="checkbox-elem">
                                    <input
                                        id="new-charm2"
                                        name="charm"
                                        type="checkbox"
                                        checked={charmList.includes(newCharm2) ? true : false}
                                        onChange={ (e)=>{ charmChangeHandler(e.currentTarget.checked, newCharm2, 2)} }
                                        disabled={newCharm2===""}
                                    />
                                    <label htmlFor="new-charm2" className="center">
                                        <textarea
                                            className="new-tag-input"
                                            rows="1"
                                            placeholder="직접 태그를 &#10;입력해보세요!"
                                            value={newCharm2}
                                            onChange={ (e)=>{ 
                                                charmChangeHandler(false, newCharm2, 2);
                                                isKorean(e.target.value) && setNewCharm2(e.target.value) 
                                            }}
                                        />
                                    </label>
                                </div>
                            : null
                            }

                            
                            { (mode==="edit" && pastCharmList.length < 1)
                            ? <div className="checkbox-elem">
                                    <input
                                        id="new-charm3"
                                        name="charm"
                                        type="checkbox"
                                        checked={charmList.includes(newCharm3) ? true : false}
                                        onChange={ (e)=>{charmChangeHandler(e.currentTarget.checked, newCharm3, 3)} }
                                        disabled={newCharm3===""}
                                    />
                                    <label htmlFor="new-charm3" className="center">
                                        <textarea 
                                            className="new-tag-input"
                                            rows="1"
                                            placeholder="직접 태그를 &#10;입력해보세요!"
                                            value={newCharm3}
                                            onChange={ (e)=>{ 
                                                charmChangeHandler(false, newCharm3, 3);
                                                isKorean(e.target.value) && setNewCharm3(e.target.value) } }
                                        />
                                    </label>
                                </div>
                            : null
                            }

                        </div>
                        </div>
                    </div>

                    <div className="input-wrapper2">
                        <label>MBTI</label>
                        {
                            mode === "view"
                            ? <div id="mbti">{ mbti }</div>
                            : <div className="edit-form-input-box">
                                <SelectBox selectedValue={mbti} setValue={setMbti} optionList={MBTIList} defaultValue={"MBTI를 선택하세요."}></SelectBox>
                            </div>
                        }
                    </div>

                    <div className="input-wrapper2">
                        <label>발달감각</label>

                        <div class="edit-form-input-box">
                            <div className="checkbox-wrapper">
                                <div
                                className="alert-msg-wrapper"
                                style={showSenseAlertMsg ? {opacity: 1} : {opacity: 0}}>
                                    {showSenseAlertMsg &&
                                    <div className="alert-msg bounce">
                                        최대 2개까지 선택 가능합니다.
                                    </div>}
                                </div>
                                {
                                    senseInfoList.map( function(sense, idx) {
                                        return(
                                            (mode==="edit" || senseIdList.includes(sense.senseId))
                                            && <div className="checkbox-elem" key={ idx }>
                                                <input
                                                    id={ "sense"+sense.senseId }
                                                    value={ sense.senseId }
                                                    name="sense"
                                                    type="checkbox"
                                                    style={mode==="view" ? null :{ width: sense.width }}
                                                    checked={senseIdList.includes(sense.senseId) ? true : false}
                                                    onClick={ (e)=>{senseChangeHandler(e.currentTarget.checked, sense.senseId) }}
                                                    disabled={mode==="view"}
                                                />
                                                <label className="sense-wrapper" htmlFor={ "sense"+sense.senseId }
                                                onMouseEnter={()=>{onSenseMouseEnter(sense)}}
                                                onMouseLeave={()=>{onSenseMouseLeave(sense)}}
                                                >
                                                    <img className="sense-img"
                                                    style={mode==="view" ? null : {padding: sense.senseId >= 4 &&'0px 70px'}} /* 귀, 손일 때에만 padding을 다르게 줌 */
                                                    src={ senseColorInfo[idx] ? sense.colorImg : sense.whiteImg }
                                                    alt="sense icon"
                                                    ></img>
                                                    { mode==="edit" && <div className="sense-name"
                                                    style={mode==="view" ? null : {left: sense.senseId >= 4 &&'175px'}}
                                                    >{ sense.name }</div> }
                                                </label>
                                            </div>  
                                        )
                                    } )
                                }
                            </div>
                            { mode==="edit" &&
                            <div
                                className="sense-description"
                                style={currSense ? {opacity: 1} : {opacity: 0}}
                                >
                                {currSense && 
                                    <div className="sense-description wrapper">
                                        <img className="sense-img" src={currSense.colorImg} alt="sense icon"></img>
                                        <div className="sense-name">{currSense.name}</div>
                                        <div className="description">{currSense.description}</div>
                                    </div>
                                }
                            </div>
                            }
                            </div>
                        </div>

                        <div className="input-wrapper">
                            <label>한줄소개 (선택)</label>
                            <textarea
                                id="introduction"
                                value={introduction}
                                maxLength={100}
                                placeholder="자기소개를 입력해주세요"
                                onChange={(e)=>{setIntroduction(e.target.value)}}
                                className="introduction-textarea"
                                disabled={mode==="view"}
                            ></textarea>
                            { mode==="edit" && 
                            <div className="introduction-length">{introduction.length}/100</div> }
                        </div>

                    </div>
                </div>
                
                <div className="center">
                {/* 페르소나가 하나밖에 없을 때엔 삭제를 막음 */}
                { personaIdList.length > 1 && <button
                className="small-btn"
                onClick={deleteAction}
                style={{marginRight: '30px', backgroundColor: '#FFA48C'}}
                >페르소나 삭제</button> }
                {
                    mode==="view"
                    ? <button
                    className="small-btn"
                    onClick={goToEditPersona}
                    >수정하기
                    </button>
                    : <button
                    className="small-btn"
                    onClick={validationCheck}
                    >수정완료
                    </button>
                }
                </div>

            </div>
        </div>
    )
}

export default MyPersona;