import axios from 'axios';
import React, { useState, useEffect } from 'react';

function Form04(props) {
    let [senseList, setSenseList] = useState([]);

    const changeHandler = (checked, sense) => {
        if (checked) {
            props.setSenseIdList([...props.senseIdList, sense])            
        } else {
            props.setSenseIdList(props.senseIdList.filter((el) => el !== sense))
        }
    }

    useEffect(() => {
        const getSenseList = async () => {
            try {
                const res = await axios.get(
                    'http://163.180.117.22:7218/api/persona-category/sense'
                )
                const temp = res.data;
                setSenseList(temp);
            } catch (err) {
                console.log(err);
            }
        }
        getSenseList();
    })

    return (
        <div style={{width:'100%'}}>

            <div className="input-wrapper" style={{marginBottom: '0px'}}>
                <label htmlFor="job" style={{marginBottom: '8px'}}>
                    발달감각 선택
                </label>
                <div style={{width:'240px'}}>
                    <div class="label-description">
                        센세이션은 크리에이터들의 [능력]을 [감각]으로 표현합니다. 사람들과 아이데이션하며 성장시키고 싶은 감각을 선택해주세요!
                    </div>
                </div>

                <div className="checkbox-wrapper">
                    {
                        senseList && senseList.map( function(sense, idx) {
                            return(
                                <div className="checkbox-elem">
                                    <input
                                        id={ sense.senseId }
                                        key={ idx }
                                        value={ sense.senseId }
                                        name="sense"
                                        type="checkbox"
                                        checked={props.senseIdList.includes(sense.senseId) ? true : false}
                                        onClick={ (e)=>{changeHandler(e.currentTarget.checked, sense.senseId)} }
                                    />
                                    <label htmlFor={ sense.senseId }>{ sense.name }</label>
                                </div>
                                
                            )
                        } )
                    }
                </div>
            </div>
            <button class="small-btn" type="submit" onClick={props.postPersona}
            disabled={ props.senseIdList.length===0 }
            >
                등록 완료
            </button>
        </div>
    );
}

export default Form04;