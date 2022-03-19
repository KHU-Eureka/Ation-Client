import React, { useState, useRef, useEffect } from 'react';

import AttrContext from './store/AttrContext';
import Stageboard from './Stageboard';
import Tool from './Tool';
import '../../assets/css/whiteboard/Whiteboard.scss';

function Whiteboard() {
    const focusTextarea = useRef();

    const [text, setText] = useState('');
    const [imgSrc, setImgSrc] = useState('');
    const [pinObject, setPinObject] = useState();
    const [isEditing, setIsEditing] = useState(false);

    const textChangeHandler = ({ target }) => {
        setText(target.value);
    }

    const textareaFocusHandler = () => {
        focusTextarea.current.focus(); 
    }

    return (
        <AttrContext>
            <div className='Whiteboard-Container'>
                <Stageboard setText={setText} text={text} imgSrc={imgSrc} pinObject={pinObject} isEditing={isEditing} setIsEditing={setIsEditing}/>
                <Tool onClick={() => setIsEditing(false)} setText={setText} setImgSrc={setImgSrc} setPinObject={setPinObject} />
                <textarea ref={focusTextarea} value={text} onChange={textChangeHandler} style={{display: 'none', border: 'none', backgroundColor: 'transparent'}} onBlur={textareaFocusHandler} />
            </div>
        </AttrContext>
    );
}

export default Whiteboard;