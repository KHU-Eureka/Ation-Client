import React, { useState, useRef, useEffect } from 'react';
import Stageboard from './Stageboard';
import Tool from './Tool';


function Whiteboard() {
    const focusTextarea = useRef();
    const [text, setText] = useState('');
    const [imgSrc, setImgSrc] = useState('');
    const [pinObject, setPinObject] = useState();

    const textChangeHandler = ({ target }) => {
        setText(target.value);
    }

    const textareaFocusHandler = () => {
        focusTextarea.current.focus(); 
    }

    return (
        <div className='Whiteboard-Container'>
            <Stageboard setText={setText} text={text} imgSrc={imgSrc} pinObject={pinObject} />
            <Tool setText={setText} setImgSrc={setImgSrc} setPinObject={setPinObject} />
            <textarea ref={focusTextarea} value={text} onChange={textChangeHandler} style={{display: 'none', border: 'none'}} onBlur={textareaFocusHandler} />
        </div>
    );
}

export default Whiteboard;