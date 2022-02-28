import { useState, useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { Cookies } from "react-cookie";
import axios from "axios";

import SelectBox from "../../views/input/SelectBox";
import { IoChevronDownOutline } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";

import { ReactComponent as Crown } from '../../../assets/svg/crown.svg';
import { ReactComponent as eye } from '../../../assets/svg/sense/eye.svg';
import { ReactComponent as nose } from '../../../assets/svg/sense/nose.svg';
import { ReactComponent as mouth } from '../../../assets/svg/sense/mouth.svg';
import { ReactComponent as ear } from '../../../assets/svg/sense/ear.svg';
import { ReactComponent as hand } from '../../../assets/svg/sense/hand.svg';


function Form03(props) {
    const cookies = new Cookies();
    const activePersonaId = useSelector((state) => state.activePersonaId)
    const { limitMember, setLimitMember, isLimit, setIsLimit, senseId, setSenseId, introduction, setIntroduction, setFormValidation } = props;
    const memberList = [...Array(30)].map((v, i)=>i+1);

    const senseInfoList = [
        { id: 1, name: "눈", svg: eye },
        { id: 2, name: "코", svg: nose },
        { id: 3, name: "입", svg: mouth },
        { id: 4, name: "귀", svg: ear },
        { id: 5, name: "손", svg: hand },
    ]
    
    let [activePersona, setActivePersona] = useState({});

    useLayoutEffect(()=> {
        const getActivePersona = async () => {
            const token = cookies.get('token');
            try {
                const res = await axios.get(
                    process.env.REACT_APP_SERVER_HOST + '/api/persona/' + activePersonaId, {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )
                setActivePersona(res.data);
            } catch(err) {
                console.log(err)
            }
        }
        getActivePersona();
    }, [activePersonaId, setActivePersona])

    useEffect(()=> {
        if (senseId && introduction)
            setFormValidation(true)
        else setFormValidation(false)
    }, [senseId, introduction])

    return (
        <div className="form03 show-modal-content">
            <div className="row1">
                <div className="input-wrapper">
                    <label>최대 인원</label>
                    <div style={{display: 'flex'}}>
                        <div 
                        className="limit-member"
                        id={!isLimit && "disabled"}
                        >
                            <IoChevronDownOutline className="down-icon"/>
                            <SelectBox selectedValue={limitMember} setValue={setLimitMember} optionList={memberList}></SelectBox>
                        </div>

                        <div className="is-limit"
                        id={!isLimit && "checked"}
                        onClick={()=>{setIsLimit(!isLimit)}}>
                            <div className="check">
                                {!isLimit && <IoMdCheckmark/>}
                            </div>
                            <div className="text">
                            {
                                isLimit
                                ? '인원 수 제한 없음'
                                : '상시 모집'
                            }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="input-wrapper">
                    <label>선호감각</label>
                    <div className="checkbox-wrapper sense-wrapper">
                        {
                            senseInfoList.map((sense, idx) => (
                                <div className="checkbox-elem sense-elem" key={idx}>
                                    <input
                                        type="checkbox"
                                        id={sense.id}
                                        value={sense.id}
                                        checked={senseId===sense.id}
                                        onChange={()=>{setSenseId(sense.id)}}
                                    />
                                    <label htmlFor={sense.id}> 
                                        <sense.svg className="sense-img"/> 
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className="input-wrapper">
                <label>한 줄 소개</label>
                <textarea
                id="introduction"
                value={introduction}
                maxLength={50}
                placeholder="라운지를 소개해주세요!"
                onChange={(e)=>{setIntroduction(e.target.value)}}
                className="introduction-textarea"
                ></textarea>
                <div className="introduction-length">{introduction.length}/50</div>
            </div>

            <div className="input-wrapper">
                <label>방장</label>
                <div className="manager-wrapper">
                    <img id="profile" src={activePersona.profileImgPath} alt="profile"></img>
                    <div id="nickname">{ activePersona.nickname }</div>
                    <Crown id="crown" />
                </div>
            </div>
        </div>
    )
}

export default Form03;