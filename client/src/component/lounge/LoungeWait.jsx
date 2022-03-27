import React from "react";

import { mainTitle } from './atoms';
import OrganismsImg from "./OrganismsImg";

function LoungeWait() {

    return (
        <article className="LoungeWait-Container">
            {mainTitle('대기중인 라운지', 'READY')}
            <OrganismsImg />
        </article>
    )
}

export default LoungeWait;