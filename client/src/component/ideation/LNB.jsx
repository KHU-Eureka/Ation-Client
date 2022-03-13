import React, { useEffect, useState } from 'react';

import '../../assets/css/ideation/LNB.scss';

import IdeationTitle from './IdeationTitle';
import IdeationList from './IdeationList';
import PersonaProfile from '../views/PersonaProfile';

function LNB() {
    return (
        <aside className='lnb-container'>
            <div style={{marginLeft: '23px'}}>
                <IdeationTitle />
                <PersonaProfile isLoungeHome={false} />
                <IdeationList />
            </div>
        </aside>
    );
}

export default LNB;