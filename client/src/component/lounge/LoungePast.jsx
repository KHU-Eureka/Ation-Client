import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { getApi } from "../state";
import { title } from './atoms';
import OrganismsRoom from "./OrganismsRoom";

function LoungePast() {
    //채연-라운지 종료 누르면 dispatch({type: 'LOUNGE_HISTORY', data: `history ${response.data}`})
    const history = useSelector((state) => state.loungeHistory);
    const [loungeList, setLoungeList] = useState();

    useMemo(() => {
        getApi(`${process.env.REACT_APP_SERVER_HOST}/api/lounge/history`).then((data) => setLoungeList(data.data));
    }, [history])

    return (
        <article className="LoungePast-Container">
            <div className="main-title-container">
                {title('참여했던 라운지')}
            </div>
            <OrganismsRoom loungeList={loungeList} isSense={false} />
        </article>
    )
}

export default LoungePast;