import React, { useState, useRef } from 'react';

import { InputTitle } from './atom';

export default function OptionTitle(props) {
    const { openOptionTitle, setOpenOptionTitle } = props;
    const inputRef = useRef();
    const [complete, setComplete] = useState(false);

    const optionTitleStyle = {
        position: 'absolute',
        top: '40px',
        left: '-10px',
    }

    const cancleClickHandler = () => {
        setOpenOptionTitle(false);
    }

    const completeClickHandler = () => {
        setComplete(true);
        setOpenOptionTitle(false);
    }

    return(
        <>
        {openOptionTitle?
            <div className='OptionTitle-container' style={optionTitleStyle}>
                <div className='OptionTitle-wrap-container'>
                    <InputTitle ref={inputRef} complete={complete} />
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