import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";

import { clickUIChangeHandler } from '../state';
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

    const completeClickHandler = ({ currentTarget }) => {

        const clickStyle = {
            background: '#FE3400',
            color: 'white',
        }

        ideationTitlePost(state.ideationId, title).then((data) => setChangeTitle(title));
        clickUIChangeHandler(clickStyle, currentTarget);
    }

    const titleChangeHandler = ({ target }) => {
        setTitle(target.value);
    }

    useEffect(() => {
        setOpenOptionTitle(false);
    }, [ChangeTitle])

    return(
        <>
        {openOptionTitle?
            <div className='OptionTitle-container' style={optionTitleStyle}>
                <div className='OptionTitle-wrap-container'>
                    <div>
                        <input className="inputTitle" value={title} onChange={titleChangeHandler} placeholder='제목을 입력해 주세요.'/>
                    </div>
                    <div>
                        <button className="cancelBtn" onClick={cancleClickHandler}>취소</button>
                        <button className="completeBtn" onClick={completeClickHandler}>완료</button>
                    </div>
                </div>
            </div>
        :null}
        </>
    );
}