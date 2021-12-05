import React, { useState } from 'react';

function Form03(props) {
    const charmNameList = ["엉뚱함", "따뜻함", "칭찬봇", "분위기메이커", "능력자"];

    let [newCharm1, setNewCharm1] = useState("");
    let [newCharm2, setNewCharm2] = useState("");
    let [newCharm3, setNewCharm3] = useState("");

    let [nextCharm1, makeNextCharm1] = useState(false);
    let [nextCharm2, makeNextCharm2] = useState(false);

    let [tempCharm, setTempCharm] = useState("");

    const newCharmIdx = [ 0, 1, 2];

    const changeHandler = (checked, charm, newCharm=false) => {
        if (checked) {
            if(props.charmList.length === 3) {
                alert("최대 3개까지만 선택 가능해요!")
            } else {
                props.setCharmList([...props.charmList, charm])
                if (newCharm) {
                    props.setNewCharmList([...props.newCharmList, charm])
                    console.log(props.newCharmList);
                }
            }
        } else {
            props.setCharmList(props.charmList.filter((el) => el !== charm))
            if (newCharm) {
                props.setNewCharmList(props.newCharmList.filter((el) => el !== charm))
            }
        }
    }

    return (
        <div style={{width:'100%'}}>

            <div className="input-wrapper">
                <label htmlFor="job" style={{marginBottom: '8px'}}>
                    { props.nickname }님의 매력을 입력해주세요!(최대 3개)
                </label>
                <div style={{width:'240px'}}>
                    <div class="label-description">
                        매력 정보는 다른 크리에이터들에게 본인을 어필 할 수 있는 기타 정보입니다.
                    </div>
                </div>

                <div className="checkbox-wrapper">
                    {
                        charmNameList && charmNameList.map( function(charm) {
                            return(
                                <div className="checkbox-elem">
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
                        <div className="checkbox-elem">
                            <input
                                id="new-charm1"
                                name="charm"
                                type="checkbox"
                                checked={props.charmList.includes(props.newCharmList[0]) ? true : false}
                                onChange={ (e)=>{ makeNextCharm1(true); 
                                                changeHandler(e.currentTarget.checked, newCharm1, true) } }
                                disabled={newCharm1==="" || !props.newCharmList[0]}
                            />
                            <label htmlFor="new-charm1">
                                <input 
                                    id="new-tag-input"
                                    type="text"
                                    placeholder="직접 태그를 &#10;입력해보세요!"
                                    value={props.newCharmList[0]}
                                    onChange={ (e)=>{ setNewCharm1(e.target.value) } }
                                />
                            </label>
                        </div>
                    </div>

                    {
                       props.newCharmList[2] || (nextCharm2 && newCharm2 != "")
                    ? <div className="checkbox-elem">
                        <div className="checkbox-elem">
                            <input
                                id="new-charm3"
                                name="charm"
                                type="checkbox"
                                checked={props.charmList.includes(props.newCharmList[2]) ? true : false}
                                onChange={ (e)=>{changeHandler(e.currentTarget.checked, newCharm3, true)} }
                                disabled={newCharm3==="" || !props.newCharmList[2]}
                            />
                            <label htmlFor="new-charm3">
                                <input 
                                    id="new-tag-input"
                                    type="text"
                                    placeholder="직접 태그를 &#10;입력해보세요!"
                                    value={props.newCharmList[2]}
                                    onChange={ (e)=>{ setNewCharm3(e.target.value) } }
                                />
                            </label>
                        </div>
                    </div>
                    : null
                    }
                </div>
            </div>

            <div className="input-wrapper" style={{marginBottom: '0px'}}>
                <label htmlFor="mbti" style={{marginBottom: '8px'}}>
                    { props.nickname }님의 MBTI를 입력해주세요!
                </label>
                <input
                    style={{width: '300px'}}
                    id="mbti"
                    type="text"
                    placeholder="MBTI를 입력해주세요."
                    maxLength="4"
                    value={props.mbti}
                    onChange={ (e)=>{ props.setMbti(e.target.value) } }
                />
            </div>

            <button class="small-btn" onClick={props.nextPage} disabled={props.charmList==[]||props.mbti==""}>다음</button>
        </div>
    );
}

export default Form03;