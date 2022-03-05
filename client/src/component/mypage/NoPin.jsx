import React from "react";
import { useNavigate } from "react-router-dom";

import no_pin from "../../assets/svg/no_pin.svg";
import '../../assets/css/mypage/NoPin.scss';

export default function NoPin({option}) {
    const navigation = useNavigate();

    const insightNavigateHandler = () => {
        navigation('/insight');
    }

    return(
        <div className="noAllPin-Container">
            <div>
                <img className="logo" src={no_pin}/>
            </div>
            <div>
                <p className="description">아직 추가된 {option} 없어요!</p> 
            </div>
            <div>
                <button className="btn" onClick={insightNavigateHandler}>인사이트 페이지로 핀 UP 하러 가기</button>
            </div>
        </div>
    );
}