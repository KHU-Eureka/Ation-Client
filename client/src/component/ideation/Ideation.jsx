import React from 'react';

import LNB from './LNB';
import Whiteboard from '../whiteboard/Whiteboard';
import '../../assets/css/ideation/ideationPage.scss';

function Ideation() {

    return (
        <div className='ideation-page-Container'>
            <aside className='lnb-container'>
                <LNB/>
            </aside>
            <main className='whiteboard-container'>
                <Whiteboard/>
            </main>
        </div>
    );
}

export default Ideation;