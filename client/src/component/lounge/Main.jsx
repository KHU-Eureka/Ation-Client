import { useEffect } from "react";
import { useDispatch } from "react-redux";

import MainLNB from './MainLNB';
import LoungeWait from "./LoungeWait";
import LoungeLive from "./LoungeLive";
import LoungeRecent from "./LoungeRecent";

import "../../assets/css/lounge/Lounge.scss";

function Lounge() {
    const dispatch = useDispatch();

    useEffect(()=> {
        dispatch({type: 'MENU', data: 'lounge'});
    }, [])

    return (
        <div className="Lounge-Container">
            <MainLNB />
            <section className="loungeSection-container">
                <LoungeWait />
                <LoungeLive />
                <LoungeRecent />
            </section>
        </div>
    )
}

export default Lounge;