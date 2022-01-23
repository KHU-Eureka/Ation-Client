import React, { useState, useEffect } from 'react';
import SelectBox from '../../views/input/SelectBox';
import './SenseTag.css';

function Form03(props) {
    const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/;
    const charmNameList = ["엉뚱함", "따뜻함", "칭찬봇", "분위기메이커", "능력자"];
    const MBTIList = ["ISTJ", "ISFJ", "INFJ",
                    "INTJ", "ISTP", "ISFP",
                    "INFP", "INTP", "ESTP",
                    "ESFP", "ENFP", "ENTP",
                    "ESTJ", "ESFJ", "ENFJ",
                    "ENTJ"]

    const numberAlert = "최대 3개까지 선택 가능합니다.";
    const koreanAlert = "6자리 이하의 한글만 입력 가능합니다.";

    let [showCharmAlertMsg, setShowCharmAlertMsg] = useState(false);
    let [alertMsg, setAlertMsg] = useState("");
    let [newCharm1, setNewCharm1] = useState("");
    let [newCharm2, setNewCharm2] = useState("");
    let [newCharm3, setNewCharm3] = useState("");

    let [nextCharm1, makeNextCharm1] = useState(false);
    let [nextCharm2, makeNextCharm2] = useState(false);

    const changeHandler = (checked, charm, newCharmIdx=false) => {
        if (charm && checked) {
            if(props.charmList.length === 3) {
                setAlertMsg(numberAlert)
                setShowCharmAlertMsg(true)
            } else {
                props.setCharmList([...props.charmList, charm])
                if (newCharmIdx) {
                    var tempList = [...props.newCharmList]
                    tempList[newCharmIdx] = charm
                    props.setNewCharmList(tempList)
                }
            }
        } else {
            props.setCharmList(props.charmList.filter((el) => el !== charm))
            if (newCharmIdx) {
                var tempList = [...props.newCharmList]
                tempList[newCharmIdx] = ""
                props.setNewCharmList(tempList)
            }
            setShowCharmAlertMsg(false)
        }
    }

    const isKorean = (text) => {
        setShowCharmAlertMsg(false)
        for(var c = 0; c < text.length; c++) {
            if (!korean.test(text[c])) {
                setAlertMsg(koreanAlert);
                setShowCharmAlertMsg(true);
                return false;
            }
        }
        return (text.length < 7)
    }

    useEffect(() => {
        setNewCharm1(props.newCharmList[1]);
        setNewCharm2(props.newCharmList[2]);
        setNewCharm3(props.newCharmList[3]);
    }, [])

    return (
        <div style={{width:'100%'}}>

            <div className="input-wrapper">
                <label htmlFor="job" style={{marginBottom: '8px'}}>
                    { props.nickname }님의 매력을 입력해주세요!(최대 3개)
                </label>
                <div style={{width:'240px'}}>
                    <div className="label-description">
                        매력 정보는 다른 크리에이터들에게<br/> 본인을 어필 할 수 있는 기타 정보입니다.
                    </div>
                </div>
                <div className="checkbox-wrapper">
                <div
                className="alert-msg-wrapper"
                style={showCharmAlertMsg ? {opacity: 1} : {opacity: 0}}>
                    {showCharmAlertMsg &&
                    <div className="alert-msg bounce">
                        { alertMsg }
                    </div>}
                </div>
                    {
                        charmNameList && charmNameList.map( function(charm, idx) {
                            return(
                                <div className="checkbox-elem" key={ idx }>
                                    <input
                                        id={ charm }
                                        value={ charm }
                                        name="charm"
                                        type="checkbox"
                                        checked={props.charmList.includes(charm) ? true : false}
                                        onChange={ (e)=>{ changeHandler(e.currentTarget.checked, charm) } }
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
                            checked={props.charmList.includes(newCharm1) ? true : false}
                            onChange={ (e)=>{ makeNextCharm1(true);  
                                            changeHandler(e.currentTarget.checked, newCharm1, 1) } }
                            disabled={newCharm1===""}
                        />
                        <label htmlFor="new-charm1" className="center">
                            <textarea 
                                className="new-tag-input"
                                rows="1"
                                placeholder="직접 태그를 &#10;입력해보세요!"
                                value={newCharm1}
                                onChange={ (e)=>{ isKorean(e.target.value) && setNewCharm1(e.target.value)}}
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
                            checked={props.charmList.includes(newCharm2) ? true : false}
                            onChange={ (e)=>{ makeNextCharm2(true);
                                            changeHandler(e.currentTarget.checked, newCharm2, 2)} }
                            disabled={newCharm2===""}
                        />
                        <label htmlFor="new-charm2" className="center">
                            <textarea 
                                className="new-tag-input"
                                rows="1"
                                placeholder="직접 태그를 &#10;입력해보세요!"
                                value={newCharm2}
                                onChange={ (e)=>{ isKorean(e.target.value) && setNewCharm2(e.target.value) } }
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
                            checked={props.charmList.includes(newCharm3) ? true : false}
                            onChange={ (e)=>{changeHandler(e.currentTarget.checked, newCharm3, 3)} }
                            disabled={newCharm3===""}
                        />
                        <label htmlFor="new-charm3" className="center">
                            <textarea
                                className="new-tag-input"
                                rows="1"
                                placeholder="직접 태그를 &#10;입력해보세요!"
                                value={newCharm3}
                                onChange={ (e)=>{ isKorean(e.target.value) && setNewCharm3(e.target.value) } }
                            />
                        </label>
                    </div>
                    : null
                    }
                </div>
            </div>
            
            <div className="input-wrapper" style={{marginBottom: '0px'}}>
                <label htmlFor="mbti" style={{marginBottom: '8px'}}>
                    { props.nickname }님의 MBTI를 입력해주세요!
                </label>
                <div style={{width:'240px'}}>
                    <div className="label-description">
                        MBTI는 다른 크리에이터들이 페르소나의 성격을 <br/>이해할 수 있는 기타 정보입니다.
                    </div>
                </div>
                <SelectBox selectedValue={props.mbti} setValue={props.setMbti} optionList={MBTIList} defaultValue={"MBTI를 선택하세요."}></SelectBox>
                {/* mbti form checkbox version
                <div className="checkbox-wrapper">
                    {
                        MBTIList.map(function(mbti, idx) {
                            return (
                                <div className="checkbox-elem" key={idx}>
                                    <input
                                    type="checkbox"
                                    name="mbti"
                                    id={mbti}
                                    value={mbti}
                                    checked={props.mbti === mbti}
                                    onClick={ ()=>{ props.setMbti(mbti) } }
                                    ></input>
                                    <label htmlFor={ mbti }>{ mbti }</label>
                                </div>
                            )
                        })
                    }  
                </div>
                */}
            </div>

            <button className="small-btn" onClick={props.nextPage}
            disabled={ props.charmList===[] || props.mbti==="" }
            >다음
            </button>
        </div>
    );
}

export default Form03;