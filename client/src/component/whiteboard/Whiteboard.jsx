import React, { useState } from 'react';

import AttrContext from './store/AttrContext';
import Stageboard from './Stageboard';
import Tool from './Tool';
import '../../assets/css/whiteboard/Whiteboard.scss';

function Whiteboard({ type, roomInfo, setRoomInfo }) {
    const [imgSrc, setImgSrc] = useState('');
    const [pinObject, setPinObject] = useState();
    const [isEditing, setIsEditing] = useState(false);

    return (
        <AttrContext>
            <div className='Whiteboard-Container'>
                <Stageboard roomInfo={roomInfo} setRoomInfo={setRoomInfo} imgSrc={imgSrc} pinObject={pinObject} isEditing={isEditing} setIsEditing={setIsEditing}/>
                <Tool onClick={() => setIsEditing(false)} setImgSrc={setImgSrc} setPinObject={setPinObject} type={type}/>
            </div>
        </AttrContext>
    );
}

export default Whiteboard;