import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Form02(props) {
    let [interestList, setInterestList] = useState([]);  

    const formValidationCheck = () => {
        if (props.interestIdList.length === 0) {
            alert("최소 1개 이상 선택해주세요!")
        } else {
            props.nextPage();
        }
    }

    const changeHandler = (checked, id) => {
        if (checked) {
            if(props.interestIdList.length === 3) {
                alert("최대 3개까지만 선택 가능해요!")
            } else {
                props.setInterestIdList([...props.interestIdList, id])
            }
            
        } else {
            props.setInterestIdList(props.interestIdList.filter((el) => el !== id))
        }
    }

    useEffect(() => {
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
    }, [])

    return (
        <div style={{width:'100%'}}>
            <div className="input-wrapper" style={{marginBottom: '0px'}}>
                <label htmlFor="v" style={{marginBottom: '8px'}}>
                    분야태그(최대 3개)
                </label>
                <div style={{width:'240px'}}>
                    <div class="label-description">
                        본인의 직업/분야와 관련한 핵심 키워드를 입력해주세요.
                        크리에이터님의 프로필 메인에 노출되는 키워드입니다.
                    </div>
                </div>
                <div className="checkbox-wrapper">
                    {
                        [...interestList].map( function(interest, idx) {
                            return(
                                <div className="checkbox-elem" key={idx}>
                                    <input
                                        id={ interest.interestId }
                                        value={ interest.interestId }
                                        name="interest"
                                        type="checkbox"
                                        checked={props.interestIdList.includes(interest.interestId) ? true : false}
                                        onChange={ (e)=>{ changeHandler(e.currentTarget.checked, interest.interestId) } }
                                    />
                                    <label htmlFor={ interest.interestId }>{ interest.name }</label>
                                </div>
                                
                            )
                        } )
                    }
                </div>
            </div>
            <button class="small-btn" onClick={formValidationCheck} disabled={props.interestIdList.length===0} >다음</button>
        </div>
    );
}

export default Form02;