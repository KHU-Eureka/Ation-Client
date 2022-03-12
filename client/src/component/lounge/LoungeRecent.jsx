import React, { useEffect, useState } from "react";

import { mainTitle } from './atoms';
import OrganismsCate from './OrganismsCate';

function LoungeRecent() {
    return (
        <div className="LoungeRecent-Container">
            {mainTitle('최신 라운지')}
            <OrganismsCate />
        </div>
    )
}

export default LoungeRecent;