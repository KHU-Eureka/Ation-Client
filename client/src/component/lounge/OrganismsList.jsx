import React from "react";

import { useFetch } from '../state';

function OrganismsList() {
    const loungeList = useFetch(`${process.env.REACT_APP_SERVER_HOST}/api/lounge`);

    return (
        <div className="OrganismsList-Container" style={{background: 'pink', width: '879px', height: '466px'}}>
            
        </div>
    )
}

export default OrganismsList;