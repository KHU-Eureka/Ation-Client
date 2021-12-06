import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie'
import { useNavigate, useLocation } from 'react-router';

function Edit() {
    const cookies = new Cookies(); 
    const navigation = useNavigate();
    const { state } = useLocation();

    let [personaInfo, setPersonaInfo] = useState({});
    let [senseList, setSenseList] = useState([]);
    let [interestList, setInterestList] = useState([]);

    let [personaId, setPersonaId] = useState(null)

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

    let [profileUrl, setProfileUrl] = useState("")
    let [nickNameValidation, setNickNameValidation] = useState(false);
    let [nickNameMsg, setNickNameMsg] = useState("");
    let [tempNickName, setTempNickName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const readImage = (input) => {
        // file이 존재하는 경우
        if (input.files && input.files[0]) {
            console.log(input);
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
            console.log(uploadFile);
            const formData = new FormData()
            formData.append('profileImg', uploadFile)
            console.log('sldkjflwekj ', formData.get('profileImg'));
            setFormData(formData)
        }
    }

    const NickNameChange = (e) => {
        setNickName("")
        setTempNickName(e.target.value)
        setNickNameValidation(false)
        setNickNameMsg("닉네임 중복 검사를 해주세요")
    }


    const validationCheck = async () => {
        var token = cookies.get('token');
        const temp = tempNickName;
        try {
            const res = await axios.get(
                'http://163.180.117.22:7218/api/persona/duplicate?nickname=' + temp, {
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
                alert("최대 3개까지만 선택 가능해요!")
            } else {
                setInterestIdList([...interestIdList, id])
            }
            
        } else {
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
        if (checked) {
            if(charmList.length === 3) {
                alert("최대 3개까지만 선택 가능해요!")
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
        }
    }

    const senseChangeHandler = (checked, sense) => {
        console.log(sense);
        console.log(senseIdList);
        if (checked) {
            setSenseIdList([...senseIdList, sense])            
        } else {
            setSenseIdList(senseIdList.filter((el) => el !== sense))
        }
    }

    useEffect(() => {
        setNewCharm1(newCharmList[1]);
        setNewCharm2(newCharmList[2]);
        setNewCharm3(newCharmList[3]);

        const getInterestList = async () => {
            try {
                const res = await axios.get(
                    'http://163.180.117.22:7218/api/persona-category/interest'
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
                    'http://163.180.117.22:7218/api/persona-category/sense'
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
        console.log("state", state.personaId);
        if (state != null) {
            if (state.personaId != null) {
                const currPersonaId = state.personaId;
                setPersonaId(currPersonaId);
                console.log("personaId", setPersonaId)
            }
        }

        if (personaId != null) {
            // persona  정보를 받아옴
            const getPersona = async () => {
                const token = cookies.get('token');
                console.log(personaId);
                try {
                    const res = await axios.get(
                        'http://163.180.117.22:7218/api/persona/' + personaId, {
                            headers: {
                                Authorization: 'Bearer ' + token
                            }
                        }
                    )
                    const info = res.data
                    console.log(res.data);
                    setPersonaInfo(info)
                    alert("success")

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
                        console.log(info.senseIdList)
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
        const token = cookies.get('token');
        try {
            await axios.put(
                'http://163.180.117.22:7218/api/persona/'+personaId, 
                {
                    nickname: nickname,
                    age: age,
                    gender: gender,
                    mbti: mbti,
                    charmList: charmList,
                    job: job,
                    senseIdList: senseIdList,
                    interestIdList: interestIdList,
                }, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            )
            alert("페르소나 수정 성공!")
            // 마이페이지로 이동
            navigation('/mypage')
            console.log("edit list", senseIdList)
        } catch (err) {
            alert("페르소나 수정 실패")
            console.log(err)
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
                        <label htmlFor="profile-photo" id="profile-photo-label" style={{width: '135px', height: '135px'}}></label> 
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
                     style={{ position: 'relative', right: '-70px', color: (nickNameValidation ? '#0075FF' : '#F24822') }}
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
                            onChange={ (e)=>{setGender((e.target.value)*=1)} }
                        />
                        <label htmlFor="female">
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
                            onChange={ (e)=>{setGender((e.target.value)*=1)} }
                        />
                        <label htmlFor="male">
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
                        <div class="label-description">
                            본인의 직업/분야와 관련한 핵심 키워드를 입력해주세요. <br/>
                            크리에이터님의 프로필 메인에 노출되는 키워드입니다.
                        </div>
                    </div>
                </div>
                <div className="edit-form-input-box">
                <div className="checkbox-wrapper"  style={{marginTop:'0px'}}>
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
                        <div class="label-description">
                            매력 정보는 다른 크리에이터들에게 본인을 어필 할 수 있는 기타 정보입니다.
                        </div>
                    </div>
                </div>
                <div className="edit-form-input-box">
                <div className="checkbox-wrapper"  style={{marginTop:'0px'}}>
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
                            <label htmlFor="new-charm1">
                                <input 
                                    id="new-tag-input"
                                    type="text"
                                    placeholder="직접 태그를 &#10;입력해보세요!"
                                    value={newCharm1}
                                    onChange={ (e)=>{ setNewCharm1(e.target.value) } }
                                />
                            </label>
                        </div>
                    </div>

                    {
                       nextCharm1 || newCharm1 != ""
                    ? <div className="checkbox-elem">
                        <div className="checkbox-elem">
                            <input
                                id="new-charm2"
                                name="charm"
                                type="checkbox"
                                checked={charmList.includes(newCharm2) ? true : false}
                                onChange={ (e)=>{ makeNextCharm2(true);
                                                charmChangeHandler(e.currentTarget.checked, newCharm2, 2)} }
                                disabled={newCharm2===""}
                            />
                            <label htmlFor="new-charm2">
                                <input 
                                    id="new-tag-input"
                                    type="text"
                                    placeholder="직접 태그를 &#10;입력해보세요!"
                                    value={newCharm2}
                                    onChange={ (e)=>{ setNewCharm2(e.target.value) } }
                                />
                            </label>
                        </div>
                    </div>
                    : null
                    }

                    {
                       nextCharm2 || newCharm2 != ""
                    ? <div className="checkbox-elem">
                        <div className="checkbox-elem">
                            <input
                                id="new-charm3"
                                name="charm"
                                type="checkbox"
                                checked={charmList.includes(newCharm3) ? true : false}
                                onChange={ (e)=>{charmChangeHandler(e.currentTarget.checked, newCharm3, 3)} }
                                disabled={newCharm3===""}
                            />
                            <label htmlFor="new-charm3">
                                <input 
                                    id="new-tag-input"
                                    type="text"
                                    placeholder="직접 태그를 &#10;입력해보세요!"
                                    value={newCharm3}
                                    onChange={ (e)=>{ setNewCharm3(e.target.value) } }
                                />
                            </label>
                        </div>
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
                        <div class="label-description">
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
                        발달감각 선택
                    </label>
                    <div>
                        <div class="label-description">
                            우리는 크리에이터들의 능력을 [감각]으로 표현합니다.<br/> 사람들과 아이데이션하며 성장시키고 싶은 감각을 선택해주세요!
                        </div>
                    </div>
                </div>
                <div className="edit-form-input-box">
                    <div className="checkbox-wrapper"  style={{marginTop:'0px'}}>
                        {
                            senseList && senseList.map( function(sense, idx) {
                                return(
                                    <div className="checkbox-elem">
                                        <input
                                            id={ "sense" + sense.senseId }
                                            key={ idx }
                                            value={ sense.senseId }
                                            name="sense"
                                            type="checkbox"
                                            checked={senseIdList.includes(sense.senseId) ? true : false}
                                            onClick={ (e)=>{senseChangeHandler(e.currentTarget.checked, sense.senseId)} }
                                        />
                                        <label htmlFor={ "sense" + sense.senseId }>
                                            { sense.name }
                                        </label>
                                    </div>
                                    
                                )
                            } )
                        }
                    </div>
                </div>
            </div>
            <div className="edit-form-box" style={{flexDirection: 'row-reverse'}}>
            <button className="small-btn"
                onClick={editPersona}
            >수정완료</button>
            </div>

        </form>
    );
}

export default Edit;