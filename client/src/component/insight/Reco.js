import { React, useState, useEffect } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

import "../../assets/css/insight/Reco.css";
import reco from "../../assets/svg/reco.svg";

function Reco(props) {
    const cookies = new Cookies;
    const [RecoList, setRecoList] = useState([]);
    const [slotTrue, setSlotTrue] = useState(0);

    const imgSet = async () => {
        setRecoList([]);
        const getRandom = (min, max) => Math.random() * (max - min) + min;
        const token = cookies.get('token');
        const reco = [];
        const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/recommend/view-matrix`,{
            headers: {
                Authorization: "Bearer " + token
            }
        });
        for(var i=0; i<4; i++){
            const num = parseInt(getRandom(0,response.data.length));
            // if (! sameNum(num)) {
            //     reco.push(num);
            // } else {

            // }
            const response2 = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/insight/${response.data[num][1]}`,{
                headers: {
                    Authorization: "Bearer " + token
                }
            });
            setRecoList(prev => [...prev, response2.data]);
        }
        // const sameNum = (n) => {
        //     for (var i = 0; i < reco.length; i++) {
        //         if (n === reco[i]) {
        //             return true;
        //         }
        //     }
        //         return false;
        //     }
    }

    const slotCilckHandler = () => {
        setSlotTrue(slotTrue+1);
    }

    // useEffect(() => {
    //     imgSet();
    // }, [slotTrue]);

    return (
        <div className="Reco-container">
            <div className="recoTitle-Container">
                <div className="title-container">
                    <p className="title1">지금의 컨텐츠가, 당신의 영감으로</p>
                    {props.auth?<p className="title2">{props.userName}님에게 추천하는 오늘의 인사이트</p>:<></>}
                </div>
                {/* <div className="recoBtn-container" onClick={slotCilckHandler}>
                    <span>슬롯을 당겨 랜덤으로 인사이트를 얻어보세요!</span>
                    <img src={reco} />
                </div> */}
            </div>
            {/* {RecoList.length === 4? */}
            <div className="img-container2">
                {/* <div>
                    <span className="title-reco">{RecoList[0].title}</span>
                </div> */}
                {/* <img className="imgbox"/> src={RecoList[0].imgPath}></img> */}
                {/* <div>
                    <span className="title-reco">{RecoList[1].title}</span>
                </div> */}
                <img className="imgbox"/> 
                <img className="imgbox"/> 
                <img className="imgbox"/> 
                <img className="imgbox"/> 
                {/* src={RecoList[1].imgPath}></img> */}
                {/* <div>
                    <span className="title-reco">{RecoList[2].title}</span>
                </div> */}
                {/* <img className="imgbox"/> src={RecoList[2].imgPath}></img> */}
                {/* <div>
                    <span className="title-reco">{RecoList[3].title}</span>
                </div> */}
                {/* <img className="imgbox"/> src={RecoList[3].imgPath}></img> */}
            </div>
            {/* :<></>} */}
        </div>
    );
}

export default Reco;