import { useCallback, useEffect } from "react";

import { moduleBox } from './atoms';

function OrganismsRoom(props) {
    const { loungeList, isSense } = props;

    return (
        <>
        { loungeList !== undefined?
        <div className="LoungeRoom-container">
            <div className="LoungeRoom-wrap-container">
                {loungeList.map( lounge =>
                <>
                    {moduleBox(lounge.lounge, isSense)}
                </>    
                )}
            </div>
        </div>
        :null}
        </>
    )
}

export default OrganismsRoom;