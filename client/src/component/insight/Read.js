import { React, useState, useEffect } from "react";

import GNB from "../GNB";
import Reco from "./Reco";
import InsightLNB from "./InsightLNB"
import Modal from "../modal/Modal";
import Create from "./Create";

import prev from "../../assets/svg/prev.svg";
import pin from "../../assets/svg/pin.svg";

import "../../assets/css/insight/Read.css";

function Read() {
    const [pageNum, setPageNum] = useState(1);

    //modal...
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => {
        setModalOpen(true);
    }
    const closeModal = () => {
        setModalOpen(false);
    }
    //...modal

    

    return (
        <>
        <GNB />
        <Reco />
        <div className="Insight-container">
            <div className="Search-container">
                <input className="search" placeholder="영감을 얻고 싶은 키워드를 검색해 보세요!"></input>
                <button className="search-btn" onClick={()=> {setPageNum(1); openModal();}}>+ Insight</button>
                <Modal open={modalOpen}>
                    <Create pageNum={pageNum} setPageNum={setPageNum} close={closeModal} header={prev}/>
                </Modal>
            </div>
            <div className="Content-container">
                <InsightLNB />
                <div className="img-container">
                    <ul>
                        <li><img className="thumbnail-box"></img><img src={pin} style={{position: 'absolute', left: '1011px'}}></img></li>
                        <li><img className="thumbnail-box"></img></li>
                        <li><img className="thumbnail-box"></img></li>
                        <li><img className="thumbnail-box"></img></li>
                    </ul>
                </div>
            </div>
        </div>
        </>
    );
}

export default Read;