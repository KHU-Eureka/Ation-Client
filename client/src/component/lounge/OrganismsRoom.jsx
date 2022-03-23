import { useCallback, useEffect } from "react";

import NonGraphic from "../views/NonGraphic";
import { DEFAULT_BG_STYLE } from "./atomStyleSheet";
import { defaultText, Modulebox } from './atoms';

function OrganismsRoom(props) {
    const { loungeList, isSense, link, setDeleteLounge } = props;

    return (
        <>
        { loungeList !== undefined?
        <div className="LoungeRoom-container" style={loungeList.length === 0 ? DEFAULT_BG_STYLE:null}>
            {loungeList.length !== 0?
            <div className="LoungeRoom-wrap-container">
                {loungeList.map( lounge =>
                    <Modulebox obj={lounge.lounge} isSense={isSense} link={link} setDeleteLounge={setDeleteLounge} /> 
                )}
            </div>
            :isSense?<NonGraphic type={'lounge'} isImg={true} mainText={defaultText} />
            :<NonGraphic type={'lounge'} isImg={false} mainText={defaultText} />
            }
        </div>
        :null}
        </>
    )
}

export default OrganismsRoom;