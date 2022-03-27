import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";

import { getApi } from "../state";
import { mainTitle } from './atoms';
import OrganismsRoom from "./OrganismsRoom";

function LoungeLive() {
    //채연-라운지 시작 누르면 dispatch({type: 'LOUNGE_LIVE', data: `live ${response.data}`})
    const live = useSelector((state) => state.loungeLive);
    const [loungeList, seLoungeList] = useState();

    useMemo(() => {
        getApi(`${process.env.REACT_APP_SERVER_HOST}/api/lounge/current`).then((data) => seLoungeList(data.data));
    }, [live])

    return (
        <article className="LoungeLive-Container">
            {mainTitle('나의 실시간 라운지', 'START')}
            <OrganismsRoom loungeList={loungeList} isSense={true} />
        </article>
    )
}

export default LoungeLive;