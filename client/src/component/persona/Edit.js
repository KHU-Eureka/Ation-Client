import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie'
import { useNavigate, useLocation } from 'react-router';
import { MdCloudUpload } from 'react-icons/md';
import { BsCheck2 } from 'react-icons/bs';

import eye_white from '../../assets/image/sense/눈_white.png';
import eye_color from '../../assets/image/sense/눈_color.png';
import nose_white from '../../assets/image/sense/코_white.png';
import nose_color from '../../assets/image/sense/코_color.png';
import mouse_white from '../../assets/image/sense/입_white.png';
import mouse_color from '../../assets/image/sense/입_color.png';
import ears_white from '../../assets/image/sense/귀_white.png';
import ears_color from '../../assets/image/sense/귀_color.png';
import hand_white from '../../assets/image/sense/손_white.png';
import hand_color from '../../assets/image/sense/손_color.png';

function Edit() {
    const cookies = new Cookies(); 
    const navigation = useNavigate();
    const { state } = useLocation();

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

    let [profileUrl, setProfileUrl] = useState("")
    let [nickNameValidation, setNickNameValidation] = useState(false);
    let [nickNameMsg, setNickNameMsg] = useState("");
    let [tempNickName, setTempNickName] = useState("");
    let [currSense, setCurrSense] = useState(null);
    let [senseColorInfo, setSenseColorInfo] = useState([true, true, true, true, true]); // sense icon의 현재 색상 유무를 나타내는 lsit

    let [showInterestAlertMsg, setShowInterestAlertMsg] = useState(false);
    let [showCharmAlertMsg, setShowCharmAlertMsg] = useState(false);
    let [showSenseAlertMsg, setShowSenseAlertMsg] = useState(false);

    const senseInfoList = [
        { senseId: 1, name: "눈", width: '120px', whiteImg: eye_white, colorImg: eye_color, description: "세상의 흐름을 통찰력 있게 바라볼 수 있는 능력을 의미합니다." },
        { senseId: 2, name: "코", width: '120px', whiteImg: nose_white, colorImg: nose_color, description: "센스있게 핵심 포인트를 잘 짚는 능력을 의미합니다." },
        { senseId: 3, name: "입", width: '120px', whiteImg: mouse_white, colorImg: mouse_color, description: "주도적으로 대화하고, 소통을 잘하는 능력을 의미합니다." },
        { senseId: 4, name: "귀", width: '190px', whiteImg: ears_white, colorImg: ears_color, description: "타인의 이야기를 경청할 수 있는 능력을 의미합니다." },
        { senseId: 5, name: "손", width: '190px', whiteImg: hand_white, colorImg: hand_color, description: "이야기, 정보들을 정리하고 시각화하는 능력을 의미합니다." },
    ]

    const handleSubmit = (e) => {
        e.preventDefault();
    }

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
        setNickName("")
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
                setNickName(tempNickName);
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

    let [nextCharm1, makeNextCharm1] = useState(false);
    let [nextCharm2, makeNextCharm2] = useState(false);

    const charmChangeHandler = (checked, charm, newCharmIdx=false) => {
        if (charm && checked) {
            if(charmList.length === 3) {
                setShowCharmAlertMsg(true)
            } else {
                setCharmList([...charmList, charm])
                if (newCharmIdx) {
                    var tempList = [...newCharmList]
                    tempList[newCharmIdx] = charm
                    setNewCharmList(tempList)
                }
            }
        } else {
            setCharmList(charmList.filter((el) => el !== charm))
            if (newCharmIdx) {
                var tempList = [...newCharmList]
                tempList[newCharmIdx] = ""
                setNewCharmList(tempList)
            }
            setShowCharmAlertMsg(false)
        }
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
                const token = localStorage.getItem('token');
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

    const editPersona = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(
                process.env.REACT_APP_SERVER_HOST+'/api/persona/'+personaId, 
                {
                    nickname: nickname,
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
            navigation('/mypage', { state: {alert:{title: "페르소나 수정을 완료했습니다", subtitle: ""}}})
        } catch (err) {
            console.log(err)
        }
    }

    const postProfileImg = async () => {
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
            console.log(err);
        }
    }

    const changeActivePersona = async (personaId) => {
        const token = localStorage.getItem('token')
        try {
            await axios.put(
                process.env.REACT_APP_SERVER_HOST+'/api/persona/user/' + personaId, {},
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            )
        } catch (err) {
            console.log(err)
        }
    }

    const deletePersona = async () => {
        const token = localStorage.getItem('token')
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

    return (
        (personaId != null) && <form className="form-wrapper" onSubmit={ handleSubmit }>
            <div className="title" style={{ marginBottom: '110px' }}>
                페르소나 수정
            </div>
            <div className="edit-form-box">
                <div className="edit-form-description-box">
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
                        <div id="profile-photo-preview"
                        style={{backgroundImage: 'url('+profileUrl+')', width: '135px', height: '135px'}}>
                        <label htmlFor="profile-photo" id="profile-photo-label" style={{width: '135px', height: '135px', lineHeight: '135px'}}>
                        <MdCloudUpload />
                        </label> 
                        </div>            
                    </div>
                </div>
                <div className="edit-form-input-box">
                <div className="input-wrapper">
                <label htmlFor="nickname">
                    닉네임
                </label>
                <div style={{width:'100%', display: 'flex', alignItems: 'baseline'}}>
                <div>
                    <input
                        style={{width: '300px'}}
                        id="nickname"
                        type="text"
                        placeholder="활동할 페르소나의 닉네임을 입력해주세요."
                        onChange={ NickNameChange }
                        value={ tempNickName }
                    />
                    <div
                     style={{ color: (nickNameValidation ? '#0075FF' : '#F24822') }}
                     className="alert-msg">{ nickNameMsg }
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
                    placeholder="현재 직업을 입력해주세요."
                    onChange={ (e)=>{ setJob(e.target.value) } }
                    value={ job }
                />
            </div>

            <div className="input-wrapper">
                <label htmlFor="age">
                    나이
                </label>
                <input
                    style={{width: '300px'}}
                    id="age"
                    type="number"
                    placeholder="나이를 입력해주세요."
                    onChange={ (e)=>{ setAge(e.target.value) } }
                    value={ age }
                />
            </div>

            <div className="input-wrapper">
                <label htmlFor="gender">
                    성별
                </label>
                <div className="radio-wrapper">
                    <div className="radio-elem">
                    <input
                            id="female"
                            type="radio"
                            value="1"
                            checked={gender===1}
                            name="gender"
                            onChange={ (e)=>{setGender((e.target.value)*1)} }
                        />
                        <BsCheck2
                        id="check-icon"
                        onClick={ (e)=>{setGender(1)} }
                        />
                        <label htmlFor="female" className="gender-label">
                            여
                        </label>
                    </div>

                    <div className="radio-elem">
                        <input
                            id="male"
                            type="radio"
                            value="2"
                            checked={gender===2}
                            name="gender"
                            className="gender-radio"
                            onChange={ (e)=>{setGender((e.target.value)*1)} }
                        />
                        <BsCheck2
                        id="check-icon"
                        onClick={ (e)=>{setGender(2)} }
                        />
                        <label htmlFor="male" className="gender-label">
                            남
                        </label>
                    </div>
                </div>
            </div>
                </div>
            </div>

            <div className="edit-form-box">
                <div className="edit-form-description-box">
                    <label htmlFor="v" style={{marginBottom: '10px'}}>
                        분야태그(최대 3개)
                    </label>
                    <div style={{textAlign: 'left'}}>
                        <div className="label-description">
                            본인의 직업/분야와 관련한 핵심 키워드를 입력해주세요. <br/>
                            크리에이터님의 프로필 메인에 노출되는 키워드입니다.
                        </div>
                    </div>
                </div>
                <div className="edit-form-input-box">
                <div className="checkbox-wrapper"  style={{marginTop:'0px'}}>
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
                                <div className="checkbox-elem" key={idx}>
                                    <input
                                        id={ interest.interestId }
                                        value={ interest.interestId }
                                        name="interest"
                                        type="checkbox"
                                        checked={interestIdList.includes(interest.interestId) ? true : false}
                                        onChange={ (e)=>{ interestChangeHandler(e.currentTarget.checked, interest.interestId) } }
                                    />
                                    <label htmlFor={ interest.interestId }>{ interest.name }</label>
                                </div>
                                
                            )
                        } )
                    }
                </div>
                </div>
            </div>

            <div className="edit-form-box">
                <div className="edit-form-description-box">
                    <label htmlFor="job" style={{marginBottom: '8px'}}>
                        { nickname }님의 매력
                    </label>
                    <div style={{textAlign: 'left'}}>
                        <div className="label-description">
                            매력 정보는 다른 크리에이터들에게 본인을 어필 할 수 있는 기타 정보입니다.
                        </div>
                    </div>
                </div>
                <div className="edit-form-input-box">
                <div className="checkbox-wrapper"  style={{marginTop:'0px'}}>
                <div
                className="alert-msg-wrapper"
                style={showCharmAlertMsg ? {opacity: 1, top:"-10px"} : {opacity: 0, top:"-10px"}}>
                    {showCharmAlertMsg &&
                    <div className="alert-msg bounce">
                        최대 3개까지 선택 가능합니다.
                    </div>}
                </div>
                    {
                        pastCharmList && pastCharmList.map( function(charm, idx) {
                            return(
                                <div className="checkbox-elem" key={ idx }>
                                    <input
                                        id={ charm }
                                        value={ charm }
                                        name="charm"
                                        type="checkbox"
                                        checked={charmList.includes(charm) ? true : false}
                                        onChange={ (e)=>{ charmChangeHandler(e.currentTarget.checked, charm) } }
                                    />
                                    <label htmlFor={ charm }>{ charm }</label>
                                </div>
                                
                            )
                        } )
                    }
                    
                    <div className="checkbox-elem">
                        <input
                            id="new-charm1"
                            name="charm"
                            type="checkbox"
                            checked={charmList.includes(newCharm1) ? true : false}
                            onChange={ (e)=>{ makeNextCharm1(true);  
                                            charmChangeHandler(e.currentTarget.checked, newCharm1, 1) } }
                            disabled={newCharm1===""}
                        />
                        <label htmlFor="new-charm1" className="center">
                            <textarea 
                                className="new-tag-input"
                                rows="1"
                                placeholder="직접 태그를 &#10;입력해보세요!"
                                value={newCharm1}
                                onChange={ (e)=>{ setNewCharm1(e.target.value) } }
                            />
                        </label>
                    </div>

                    {
                       nextCharm1 || newCharm1 !== ""
                    ? <div className="checkbox-elem">
                            <input
                                id="new-charm2"
                                name="charm"
                                type="checkbox"
                                checked={charmList.includes(newCharm2) ? true : false}
                                onChange={ (e)=>{ makeNextCharm2(true);
                                                charmChangeHandler(e.currentTarget.checked, newCharm2, 2)} }
                                disabled={newCharm2===""}
                            />
                            <label htmlFor="new-charm2" className="center">
                                <textarea
                                    className="new-tag-input"
                                    rows="1"
                                    placeholder="직접 태그를 &#10;입력해보세요!"
                                    value={newCharm2}
                                    onChange={ (e)=>{ setNewCharm2(e.target.value) } }
                                />
                            </label>
                        </div>
                    : null
                    }

                    {
                       nextCharm2 || newCharm2 !== ""
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
                                    onChange={ (e)=>{ setNewCharm3(e.target.value) } }
                                />
                            </label>
                        </div>
                    : null
                    }
                </div>
                </div>
            </div>

            <div className="edit-form-box">
                <div className="edit-form-description-box">
                    <label htmlFor="mbti" style={{marginBottom: '8px'}}>
                        { nickname }님의 MBTI
                    </label>
                    <div style={{textAlign: 'left'}}>
                        <div className="label-description">
                                MBTI는 다른 크리에이터들이 페르소나의 성격을 이해할 수 있는 기타 정보입니다.
                        </div>
                    </div>
                </div>
                <div className="edit-form-input-box">
                    <input
                        style={{width: '300px', fontSize: '38px', fontWeight: '700', textAlign: 'center'}}
                        id="mbti"
                        type="text"
                        placeholder="MBTI를 입력해주세요."
                        maxLength="4"
                        value={mbti}
                        onChange={ (e)=>{ setMbti(e.target.value) } }
                    />
                </div>
            </div>

            <div className="edit-form-box">
                <div className="edit-form-description-box">
                    <label htmlFor="job" style={{marginBottom: '8px'}}>
                        발달감각 선택(최대 2개)
                    </label>
                    <div>
                        <div className="label-description">
                            우리는 크리에이터들의 능력을 [감각]으로 표현합니다.<br/> 사람들과 아이데이션하며 성장시키고 싶은 감각을 선택해주세요!
                        </div>
                    </div>
                </div>
                <div className="edit-form-input-box">
                <div className="checkbox-wrapper"  style={{marginTop:'0px'}}>
                    <div
                    className="alert-msg-wrapper"
                    style={showSenseAlertMsg ? {opacity: 1, top:"-10px"} : {opacity: 0, top:"-10px"}}>
                        {showSenseAlertMsg &&
                        <div className="alert-msg bounce">
                            최대 2개까지 선택 가능합니다.
                        </div>}
                    </div>
                        {
                            senseInfoList.map( function(sense, idx) {
                                return(
                                    <div className="checkbox-elem" key={ idx }>
                                        <input
                                            id={ "sense"+sense.senseId }
                                            value={ sense.senseId }
                                            name="sense"
                                            type="checkbox"
                                            style={{ width: sense.width }}
                                            checked={senseIdList.includes(sense.senseId) ? true : false}
                                            onClick={ (e)=>{senseChangeHandler(e.currentTarget.checked, sense.senseId) }}
                                        />
                                        <label className="sense-wrapper" htmlFor={ "sense"+sense.senseId }
                                        onMouseEnter={()=>{onSenseMouseEnter(sense)}}
                                        onMouseLeave={()=>{onSenseMouseLeave(sense)}}
                                        >
                                            <img className="sense-img"
                                            style={{padding: sense.senseId >= 4 &&'0px 55px'}} /* 귀, 손일 때에만 padding을 다르게 줌 */
                                            src={ senseColorInfo[idx] ? sense.colorImg : sense.whiteImg }
                                            alt="sense icon"
                                            ></img>
                                            <div className="sense-name">{ sense.name }</div>
                                        </label>
                                    </div>  
                                )
                            } )
                        }
                    </div>
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
                </div>
            </div>
            <div className="edit-form-box">
                <div className="edit-form-description-box">
                    <label htmlFor="introduction" style={{marginBottom: '8px'}}>
                        한줄 소개
                    </label>
                    <div>
                        <div className="label-description">
                            다른 크리에이터들에게 본인을 소개해보세요!
                        </div>
                    </div>
                </div>
                <div className="edit-form-input-box">
                <textarea
                id="introduction"
                value={introduction}
                maxLength={100}
                placeholder="자기소개를 입력해주세요"
                onChange={(e)=>{setIntroduction(e.target.value)}}
                className="introduction-textarea"
                ></textarea>
                <div className="introduction-length">{introduction.length}/100</div>
                </div>
            </div>

            <div className="center">
            {/* 페르소나가 하나밖에 없을 때엔 삭제를 막음 */}
            { personaIdList.length > 1 && <button
            className="small-btn"
            onClick={deleteAction}
            style={{marginRight: '30px', backgroundColor: '#FFA48C'}}
            >페르소나 삭제</button> }

            <button
            className="small-btn"
            onClick={editPersona}
            >수정완료</button>
            </div>

        </form>
    );
}

export default Edit;