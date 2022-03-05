import React from "react";

import { mainTitle } from './atoms';
import OrganismsCate from './OrganismsCate';
import OrganismsList from "./OrganismsList";

function LoungeRecent() {

    return (
        <div className="LoungeRecent-Container">
            {mainTitle('최신 라운지')}
            <OrganismsCate />
            <OrganismsList />
        </div>
    )
}

export default LoungeRecent;