import React from "react";

function Form05(props) {
    return (
        <div style={{width: '100%'}}>

        <div className="input-wrapper">
            <label htmlFor="introduction" style={{marginBottom: '8px'}}>
                한줄 소개
            </label>
            <div style={{width:'240px'}}>
                <div className="label-description">
                    다른 크리에이터들에게 본인을 소개해보세요!
                </div>
            </div>

            <textarea
            id="introduction"
            value={props.introduction}
            maxLength={100}
            placeholder="자기소개를 입력해주세요"
            onChange={(e)=>{props.setIntroduction(e.target.value)}}
            className="introduction-textarea"
            ></textarea>
            <div className="introduction-length">{props.introduction.length}/100</div>
        </div>

        <button className="small-btn" type="submit"
        onClick={props.postPersona}
        disabled={ props.introduction.length===0 }
        >
                등록 완료
            </button>
        </div>
        
    )
}

export default Form05;