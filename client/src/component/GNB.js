import { React } from "react";
import { Link } from "react-router-dom";

import "../assets/css/GNB.css";
import logo from "../assets/svg/logo_main.svg";
import bell from "../assets/svg/bell.svg";
import profile from "../assets/svg/profile.svg";

function GNB() {
    return (
        <div className="GNB-container">
            <div className="gnb-flex-container">
            <div className="Logo-container">
                <img className="logo" src={logo} />
            </div>
            <div className="Btn-container">
                <li className="btn-li">
                    <span className="lounge-btn">Lounge</span>
                </li>
                <li className="btn-li">
                <Link to="/insight" style={{textDecoration: 'none'}}>
                    <span className="insight-btn">Insight</span>
                </Link>
                </li>
                <li className="btn-li">
                <Link to="/mypage" style={{textDecoration: 'none'}}>
                    <span className="mypage-btn">Mypage</span>
                </Link>
                </li>
            </div>
            <div className="Profile-container">
                <button className="openlounge-btn">Open Lounge</button>
                <img className="bell" src ={bell} width="30px" />
                <img src ={profile} width="30px" />
            </div>
            </div>
        </div>
    );
}

export default GNB;