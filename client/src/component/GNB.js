import { React } from "react";

import "../assets/css/GNB.css";
import bell from "../assets/svg/bell.svg";
import profile from "../assets/svg/profile.svg";

function GNB() {
    return (
        <div className="GNB-container">
            <div className="Logo-container">
                <span className="logo-text">Sensation</span>
            </div>
            <div className="Btn-container">
                <li>
                <span className="lounge-btn">Lounge</span>
                </li>
                <li>
                <span className="insight-btn">Insight</span>
                </li>
                <li>
                <span className="mypage-btn">Mypage</span>
                </li>
            </div>
            <div className="Profile-container">
                <button className="openlounge-btn">Open Lounge</button>
                <img className="bell" src ={bell} width="30px" />
                <img src ={profile} width="30px" />
            </div>
        </div>
    );
}

export default GNB;