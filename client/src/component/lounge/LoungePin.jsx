import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getApi } from "../state";
import { title } from './atoms';
import OrganismsRoom from "./OrganismsRoom";

function LoungePin() {
    const pinUp = useSelector((state) => state.loungePinup);
    const [loungeList, seLoungeList] = useState();
    const [deleteLounge, setDeleteLounge] = useState('');

    useEffect(() => {
        getApi(`${process.env.REACT_APP_SERVER_HOST}/api/lounge/pin`).then((data) => seLoungeList(data.data));
    }, [pinUp, deleteLounge])

    return (
        <article className="LoungePin-Container">
            <div className="main-title-container">
                {title('내가 핀 한 라운지')}
            </div>
            <OrganismsRoom loungeList={loungeList} isSense={false} link={'lounge/pin'} setDeleteLounge={setDeleteLounge}/>
        </article>
    )
}

export default LoungePin;