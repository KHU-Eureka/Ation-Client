import React from 'react';
import Stageboard from './Stageboard';
import Tool from './Tool';


function Whiteboard() {
    return (
        <div className='Whiteboard-Container'>
            <Stageboard />
            <Tool />
        </div>
    );
}

export default Whiteboard;