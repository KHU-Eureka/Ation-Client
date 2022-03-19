import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from "react-router-dom";

import { ideationTitlePost } from './state';

export default function OptionTitle(props) {
    const { state } = useLocation();
    const { openOptionTitle, setOpenOptionTitle, setChangeTitle, ChangeTitle } = props;
    const [title, setTitle] = useState("");

    const optionTitleStyle = {
        position: 'absolute',
        top: '40px',
        left: '-10px',
    }

    const cancleClickHandler = () => {
        setOpenOptionTitle(false);
    }

    const completeClickHandler = () => {
        ideationTitlePost(state.ideationId, title).then((data) => setChangeTitle(data.data));
        setOpenOptionTitle(false);
    }

    const titleChangeHandler = ({ target }) => {
        setTitle(target.value);
    }

    return(
        <>
        {openOptionTitle?
            <div className='OptionTitle-container' style={optionTitleStyle}>
                <div className='OptionTitle-wrap-container'>
                    <div>
                        <input className="inputTitle" value={title} onChange={titleChangeHandler} placeholder='제목을 입력해 주세요.'/>
                    </div>
                    <div>
                        <button onClick={cancleClickHandler}>취소</button>
                        <button className="completeBtn" onClick={completeClickHandler}>완료</button>
                    </div>
                </div>
            </div>
        :null}
        </>
    );
}