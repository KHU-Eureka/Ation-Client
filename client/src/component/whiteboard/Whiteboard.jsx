import React, { useState } from 'react';

import AttrContext from './store/AttrContext';
import Stageboard from './Stageboard';
import Tool from './Tool';
import '../../assets/css/whiteboard/Whiteboard.scss';

function Whiteboard() {
    const [imgSrc, setImgSrc] = useState('');
    const [pinObject, setPinObject] = useState();
    const [isEditing, setIsEditing] = useState(false);

    return (
        <AttrContext>
            <div className='Whiteboard-Container'>
                <Stageboard imgSrc={imgSrc} pinObject={pinObject} isEditing={isEditing} setIsEditing={setIsEditing}/>
                <Tool onClick={() => setIsEditing(false)} setImgSrc={setImgSrc} setPinObject={setPinObject} />
            </div>
        </AttrContext>
    );
}

export default Whiteboard;