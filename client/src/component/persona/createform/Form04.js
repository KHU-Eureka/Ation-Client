import React, { useState, useEffect } from 'react';
import eye_white from '../../../assets/image/sense/눈_white.png';
import eye_color from '../../../assets/image/sense/눈_color.png';
import nose_white from '../../../assets/image/sense/코_white.png';
import nose_color from '../../../assets/image/sense/코_color.png';
import mouse_white from '../../../assets/image/sense/입_white.png';
import mouse_color from '../../../assets/image/sense/입_color.png';
import ears_white from '../../../assets/image/sense/귀_white.png';
import ears_color from '../../../assets/image/sense/귀_color.png';
import hand_white from '../../../assets/image/sense/손_white.png';
import hand_color from '../../../assets/image/sense/손_color.png';


function Form04(props) {
    let [currSense, setCurrSense] = useState(null);
    let [senseColorInfo, setSenseColorInfo] = useState([true, true, true, true, true]); // sense icon의 현재 색상 유무를 나타내는 lsit
    let [showSenseAlertMsg, setShowSenseAlertMsg] = useState(false);
    const senseInfoList = [
        { senseId: 1, name: "눈", width: '120px', whiteImg: eye_white, colorImg: eye_color, description: "세상의 흐름을 통찰력 있게 바라볼 수 있는 능력을 의미합니다." },
        { senseId: 2, name: "코", width: '120px', whiteImg: nose_white, colorImg: nose_color, description: "센스있게 핵심 포인트를 잘 짚는 능력을 의미합니다." },
        { senseId: 3, name: "입", width: '120px', whiteImg: mouse_white, colorImg: mouse_color, description: "주도적으로 대화하고, 소통을 잘하는 능력을 의미합니다." },
        { senseId: 4, name: "귀", width: '190px', whiteImg: ears_white, colorImg: ears_color, description: "타인의 이야기를 경청할 수 있는 능력을 의미합니다." },
        { senseId: 5, name: "손", width: '190px', whiteImg: hand_white, colorImg: hand_color, description: "이야기, 정보들을 정리하고 시각화하는 능력을 의미합니다." },
    ]

    // 초기 선택된 sense의 icon color를 흰색으로 바꿈
    useEffect( () => {
        var temp = JSON.parse(JSON.stringify(senseColorInfo))
        for(var i = 0; i < props.senseIdList.length; i++) {
            temp[props.senseIdList[i] - 1] = false;
        }
        setSenseColorInfo(temp)
    }, [])

    const changeHandler = (checked, senseId) => {
        if (checked) {
            if (props.senseIdList.length===2) {
                setShowSenseAlertMsg(true)
            } else {
                props.setSenseIdList([...props.senseIdList, senseId])  
                reverseIconColor(senseId - 1, true)
            }
        } else {
            props.setSenseIdList(props.senseIdList.filter((el) => el !== senseId))
            reverseIconColor(senseId - 1, false)
            setShowSenseAlertMsg(false);
        }
    }

    const reverseIconColor = (idx, hoverOrChecked) => {
        var tempList = JSON.parse(JSON.stringify(senseColorInfo))
        tempList[idx] = !hoverOrChecked
        setSenseColorInfo(tempList)
    }

    const onSenseMouseEnter = (sense) => { // hover event가 일어날 때
        setCurrSense(sense) // 현재 sense의 설명을 띄움
        if (!props.senseIdList.includes(sense.senseId)) {
            reverseIconColor(sense.senseId - 1, true) // 아이콘을 흰색으로 띄워야 함
        }
    }

    const onSenseMouseLeave = (sense) => { // hover event에서 벗어날 때
        setCurrSense(null) // 현재 sense 정보를 초기화
        if (!props.senseIdList.includes(sense.senseId)) {
            reverseIconColor(sense.senseId - 1, false) // 아이콘을 색상으로 띄워야 함
        }
    }

    return (
        <div className="persona-create-page">

            <div className="input-wrapper" style={{marginBottom: '0px'}}>
                <label htmlFor="job" style={{marginBottom: '8px'}}>
                    발달감각 선택(최대 2개)
                </label>
                <div className="label-description">
                    센세이션은 크리에이터들의 [능력]을 [감각]으로 표현합니다.
                    <br/>사람들과 아이데이션하며 성장시키고 싶은 감각을 선택해주세요!
                </div>
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
                                <div className="checkbox-elem"
                                style={{ width: sense.width }}
                                key={ idx }>
                                    <input
                                        id={ sense.senseId }
                                        value={ sense.senseId }
                                        name="sense"
                                        type="checkbox"
                                        checked={props.senseIdList.includes(sense.senseId) ? true : false}
                                        onClick={ (e)=>{changeHandler(e.currentTarget.checked, sense.senseId) }}
                                    />
                                    <label className="sense-wrapper" htmlFor={ sense.senseId }
                                    onMouseEnter={()=>{onSenseMouseEnter(sense)}}
                                    onMouseLeave={()=>{onSenseMouseLeave(sense)}}
                                    >
                                        <img className="sense-img"
                                        style={{padding: sense.senseId >= 4 &&'0px 55px'}} /* 귀, 손일 때에만 padding을 다르게 줌 */
                                        src={ senseColorInfo[idx] ? sense.colorImg : sense.whiteImg }
                                        alt="sense icon"
                                        ></img>
                                        <div className="sense-name"
                                        style={{left: sense.senseId >= 4 &&'160px'}}
                                        >{ sense.name }</div>
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
            
            <button className="small-btn" onClick={props.nextPage}
            disabled={ props.senseIdList.length===0 }
            >다음
            </button>
        </div>
    );
}

export default Form04;