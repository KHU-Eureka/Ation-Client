import { React } from "react";

import GNB from "../GNB";
import Reco from "./Reco";
import InsightLNB from "./InsightLNB"
import "../../assets/css/insight/Read.css";

function Read() {
    return (
        <>
        <GNB />
        <Reco />
        <div className="Insight-container">
            <div className="Search-container">
                <input className="search" placeholder="영감을 얻고 싶은 키워드를 검색해 보세요!"></input>
                <button className="search-btn">+ Insight</button>
            </div>
            <div className="Content-container">
                <InsightLNB />
            </div>
        </div>
        </>
    );
}

export default Read;