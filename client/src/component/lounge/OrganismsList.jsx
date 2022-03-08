import React, { useCallback, useEffect, useState } from "react";

import { useFetch } from '../state';
import { imgBox } from './atoms';

function OrganismsList() {
    const loungeList = useFetch(`${process.env.REACT_APP_SERVER_HOST}/api/lounge`);

    return (
        <>
        {loungeList !== undefined?
        <div className="OrganismsList-Container" style={{background: 'salmon', width: '1400px', height: '100%', marginTop: '36px'}}>
        {loungeList.map( lounge => 
        <>
            {imgBox(lounge, true)}
        </>
        )}
        </div>
        :null}
        </>
    )
}

export default OrganismsList;