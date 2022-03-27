import { React, useState, useEffect, useRef } from "react";
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

    const slot = useRef();
    const rullet = useRef();
    const timer = useRef(null);
    const time = useRef(4);
    const [sec, setSec] = useState(4);
    let [pullSlot, setPullSlot] = useState(false);

    const removeAnimation = () => {
        slot.current.classList.remove('pull-slot');
        rullet.current.classList.remove('reco-rotate');
        document.activeElement.blur();
    }
    const rollTheRullet = () => {
        slot.current.classList.add('pull-slot');
        rullet.current.classList.add('reco-rotate');
        setPullSlot(true);
    }
    const removeRulletAnimation = () => {
        slot.current.classList.remove('pull-slot');
        rullet.current.classList.remove('reco-rotate');
        setPullSlot(false);
    }

    useEffect(()=> {
        slot.current.addEventListener('load', removeAnimation);
        slot.current.addEventListener('focus', rollTheRullet);
        slot.current.addEventListener('blur', removeRulletAnimation);
    }, [])

    useEffect(()=> {
        if (pullSlot) { 
            setSec(4); time.current = 4;
        }
        timer.current = setInterval(()=>{
            if (pullSlot) {
                setSec(time.current);
                time.current -= 1;
                console.log(time.current);
            }
        }, 1000)
        return () => clearInterval(timer.current)
    }, [pullSlot])

    useEffect(()=> {
        if (time.current <= 0) { // 3초가 모두 지난다면
            console.log('time out');
            clearInterval(timer.current);
            document.activeElement.blur();
        }
    }, [time.current])

    const slideSetting = async () => {
        const cookies = new Cookies;
        const token = localStorage.getItem('token');
        console.log("asdf")
        let temp = [];
        for(let i=0; i<4; i++) {
            // const recoResponse = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/insight/recommend`, {
            //     headers: {
            //         Authorization: "Bearer " + token
            //     }
            // });
            // temp.push(recoResponse.data);
            
            temp.push(RecoList);
        }
        setSlideReco(temp);
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
        setPullSlot(true);
    }

    useEffect(() => {
        imgSet();
        slideSetting();
        console.log(slotNum);
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
                <div className="recoBtn-container">
                    <span className="recoBtn-title">슬롯을 당겨 랜덤으로<br/>인사이트를 얻어보세요!</span>
                    <button className="recoBtn-btn" ref={slot} onClick={slotCilckHandler}>
                        <img className="recoBtn-img" src={reco}/>
                    </button>
                </div>
            </div>
            {/* 이미지 div */}
            <div className="recoImg-container" ref={rullet}>
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