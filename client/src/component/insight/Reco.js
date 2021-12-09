import { React } from "react";

import "../../assets/css/insight/Reco.css";

function Reco() {
    return (
        <div className="Reco-container">
            <div className="title-container">
                <p className="title1">지금의 컨텐츠가, 당신의 영감으로</p>
                <p className="title2">은송님에게 추천하는 오늘의 인사이트</p>
            </div>
            <div className="img-container2">
                <img className="imgbox"></img>
                <img className="imgbox"></img>
                <img className="imgbox"></img>
                <img className="imgbox"></img>
            </div>
        </div>
    );
}

export default Reco;