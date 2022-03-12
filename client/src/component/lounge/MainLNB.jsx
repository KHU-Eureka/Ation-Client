import React from "react";

import PersonaProfile from '../views/PersonaProfile';
import LoungePin from './LoungePin';
import LoungePast from './LoungePast';

function MainLNB() {

    return (
        <aside className="MainLNB-Container">
            <div className="MainLNB-wrap-Container">
                <PersonaProfile isLoungeHome={true}/>
                <LoungePin />
                <LoungePast />
            </div>
        </aside>
    )
}

export default MainLNB;