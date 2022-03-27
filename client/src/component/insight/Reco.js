import { React, useState, useEffect } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

import "../../assets/css/insight/Reco.css";
import clickBtn from "../../assets/svg/insightRecoBtn.svg";
import reco from "../../assets/svg/reco.svg";

function Reco(props) {
    const {insight} = props;
    const cookies = new Cookies;
    const [RecoList, setRecoList] = useState([]);
    const [slideReco, setSlideReco] = useState([]);
    const [slotNum, setSlotNum] = useState(0);
    const idx = [0, 1, 2, 3];

    const slideSetting = async () => {
        const cookies = new Cookies;
        const token = localStorage.getItem('token');
        let temp = [];
        for(let i=0; i<4; i++) {
            const recoResponse = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/insight/recommend`, {
                headers: {
                    Authorization: "Bearer " + token
                }
            });
            temp.push(recoResponse.data);
            setSlideReco(temp);
        }
    }

    const imgSet = async () => {
        if(props.auth) {
            const token = localStorage.getItem('token');
            try {
                const recoResponse = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/insight/recommend`, {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                });
                setRecoList(recoResponse.data);
            } catch(err) {
                console.log(err)
            }
        } else {
            const randomResponse = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/insight/random`);
            setRecoList(randomResponse.data);
        }
    }

    const slotCilckHandler = () => {
        setSlotNum(slotNum + 1);
    }

    useEffect(() => {
        imgSet();
        // slideSetting();
        if(props.auth) {
            slideSetting();
            console.log(slideReco.length)
        }
    }, [slotNum]);

    const insightClickHandler = ({ currentTarget }) => {
        const idx = parseInt(currentTarget.getAttribute('id'));
        window.open(`${RecoList[idx].url}`);
    }

    return (
        <div className="Reco-container">
            {/* 타이틀 div */}
            <div className="recoTitle-Container">
                <div className="title-container">
                    <p className="title1">지금의 컨텐츠가, 당신의 영감으로</p>
                    {props.auth?<p className="title2">{props.userName}님에게 추천하는 오늘의 인사이트</p>:<></>}
                </div>
                <div className="recoBtn-container" onClick={slotCilckHandler}>
                    <span className="recoBtn-title">슬롯을 당겨 랜덤으로<br/>인사이트를 얻어보세요!</span>
                    <img className="recoBtn-img" src={reco} />
                </div>
            </div>
            {/* 이미지 div */}
            <div className="recoImg-container">
                {idx.map( i => 
                <div className="slide-container">
                    <div className="slide-wrap-container">
                        <div className="recoImg" id={i} style={RecoList[i] === undefined?{background: 'rgba(115, 115, 115, 0.58)'}:{position: 'relative', background: 'rgba(115, 115, 115, 0.58)'}} onClick={RecoList[i] !== undefined?insightClickHandler:null}>
                            {RecoList[i] !== undefined &&
                            <>
                            <img className="imgbox" src={RecoList[i].imgPath} style={{zIndex: '-1', position: 'absolute', top: '0'}}/> 
                            <div className="recoImg-contents-container">
                                <div className="recoImg-title-container">
                                    <span className="recoImg-title">{RecoList[i].title}</span>
                                </div>
                                <div className="recoImg-btn-container">
                                    <img src={clickBtn}/>
                                </div>
                            </div>
                            </>
                            }
                        </div>
                        {slideReco!==0 && slideReco[i]!==undefined? slideReco[i].map( slide => 
                        <div className="recoImg">
                            <img className="imgbox" src={slide.imgPath} style={{position: 'absolute', top: '0'}}/> 
                            <div className="recoImg-contents-container">
                                <div className="recoImg-title-container">
                                    <span className="recoImg-title">{slide.title}</span>
                                </div>
                                <div className="recoImg-btn-container">
                                    <img src={clickBtn}/>
                                </div>
                             </div>   
                        </div>):null}
                    </div>
                </div>)}
            </div>
        </div>
    );
}

export default Reco;