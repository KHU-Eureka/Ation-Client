import React, { useEffect } from 'react';

import AttrContext from './store/AttrContext';

import LNB from './LNB';
import Whiteboard from '../whiteboard/Whiteboard';
import '../../assets/css/ideation/ideationPage.scss';

function Ideation() {

    return (
        <AttrContext>
            <div className='ideation-page-Container'>
                <LNB />
                <main className='whiteboard-container'>
                    <Whiteboard/>
                </main>
            </div>
        </AttrContext>
    );
}

export default Ideation;