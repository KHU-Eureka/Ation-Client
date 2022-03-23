import React, { useState } from 'react';

import '../../assets/css/ideation/LNB.scss';

import IdeationTitle from './IdeationTitle';
import IdeationList from './IdeationList';
import PersonaProfile from '../views/PersonaProfile';

function LNB() {
    const [ChangeTitle, setChangeTitle] = useState(0);

    return (
        <aside className='lnb-container'>
            <div style={{marginLeft: '23px'}}>
                <IdeationTitle ChangeTitle={ChangeTitle} setChangeTitle={setChangeTitle} />
                <PersonaProfile isLoungeHome={false} />
                <IdeationList ChangeTitle={ChangeTitle} />
            </div>
        </aside>
    );
}

export default LNB;