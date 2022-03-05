import React from "react";

import { mainTitle } from './atoms';
import OrganismsRoom from "./OrganismsRoom";

function LoungeLive() {

    return (
        <article className="LoungeLive-Container">
            {mainTitle('나의 실시간 라운지', 'START')}
            <OrganismsRoom />
        </article>
    )
}

export default LoungeLive;