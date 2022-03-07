import { useCallback, useEffect } from "react";

import { useFetch } from "../state";
import { moduleBox } from './atoms';

function LoungeRoom() {
    const loungeList = useFetch(`${process.env.REACT_APP_SERVER_HOST}/api/lounge/current`);

    return (
        <>
        { loungeList !== undefined?
        <div className="LoungeRoom-container" style={{background: '#F5F5F5', width: '411px', height: '446px', borderRadius: '10px'}}>
            <div className="LoungeRoom-wrap-container">
                {loungeList.map( lounge =>
                <>
                    {moduleBox(lounge.lounge)}
                </>    
                )}
            </div>
        </div>
        :null}
        </>
    )
}

export default LoungeRoom;