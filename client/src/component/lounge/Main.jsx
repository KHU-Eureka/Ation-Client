import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";

import Alert from "../views/Alert";
import MainLNB from './MainLNB';
import LoungeWait from "./LoungeWait";
import LoungeLive from "./LoungeLive";
import LoungeRecent from "./LoungeRecent";

import "../../assets/css/lounge/Lounge.scss";

function Lounge() {
    const dispatch = useDispatch();
    var { state } = useLocation();

    // alert 관련
    let [showAlert, setShowAlert] = useState(false);
    let [alertTitle, setAlertTitle] = useState("");
    let [alertSubtitle, setAlertSubtitle] = useState("");

    useEffect(() => { // 띄울 alert가 있으면 띄움
        if (state) {
            if (state.alert) {
                var alertInfo = state.alert;
                setAlertTitle(alertInfo.title);
                setAlertSubtitle(alertInfo.subtitle);
                setShowAlert(true);
            }
        }
    }, [])

    useEffect(()=> {
        dispatch({type: 'MENU', data: 'lounge'});
    }, [])

    return (
        <div className="Lounge-Container">
            <Alert alertTitle={alertTitle} alertSubtitle={alertSubtitle} showAlert={showAlert} setShowAlert={setShowAlert}/>
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