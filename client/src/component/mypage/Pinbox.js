import { React, useState, useEffect } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

import "../../assets/css/mypage/pinbox.css";
import plus from "../../assets/svg/plus.svg";
import search from "../../assets/svg/search.svg";
import bin from "../../assets/svg/bin.svg";
import del from "../../assets/svg/delete.svg";
import del_check from "../../assets/svg/delete_check.svg";
import circle from "../../assets/svg/circle.svg";
import edit from "../../assets/svg/edit.svg";

function Pinbox(props) {
    const cookies = new Cookies;

    const {activePersonaId} = props;

    const [pinboard, setPinboard] = useState([]);
    const [allPin, setAllPin] = useState([]);
    const [pinboardId, setPinboardId] = useState(0);
    const [viewOption, setViewOption] = useState(0);
    const [pinSearch, setPinSearch] = useState("");

    const pinBoardClickHandler = async () => {
        const token = cookies.get('token');
        const response = await axios.get(`http://163.180.117.22:7218/api/pin-board/?personaId=${activePersonaId}`,{
            headers: {
                Authorization: "Bearer " + token
            }
        });
        setPinboard(response.data);
        setViewOption(1);
        }

    const allPinHandler = async () => {
        const token = cookies.get('token');
        const response = await axios.get(`http://163.180.117.22:7218/api/pin?personaId=${activePersonaId}`,{
            headers: {
                Authorization: "Bearer " + token
            }
        });
        setAllPin(response.data);
        setViewOption(0);
    }

    useEffect(() => {
        if(viewOption === 0) {
            allPinHandler();
        } else if(viewOption === 1) {
            pinBoardClickHandler();
        }
    }, [activePersonaId]);

    const pinAddClickHandler = async() => {
        const token = cookies.get('token');
        const response = await axios.post('http://163.180.117.22:7218/api/pin',
        {
            "pinBoardId": pinboardId,
            "tagList": [
              "string"
            ],
            "url": "string"
          }, 
          {
          headers: {
                Authorization: "Bearer " + token
            }
        }
        )
    }

    const searchBtnClickHandler = () => {
        document.querySelector(".pin-search-input-noClick").classList.add("pin-search-input")
    }

    const pinMouseOnHandler = (e) => {
        if(!document.querySelector(".clickDel")) {
            let doc = "";
            if(e.target.className === "Mypin-item" || e.target.className === "pin-img") {
                console.log(e.target.parentNode);
                doc = e.target.parentNode;
            } else if(e.target.className === "pin-name" || e.target.className === "pin-title") {
                console.log(e.target.parentNode.parentNode);
                doc = e.target.parentNode.parentNode;
            } else {
                console.log(e.target.parentNode.parentNode.parentNode);
                doc = e.target.parentNode.parentNode.parentNode;
            }
            doc.querySelector(".pin-img").style.filter="grayscale(60%)";
            doc.querySelector(".noclick").classList.add("clickPin");
        }
    }

    const pinMouseOutHandler = (e) => {
        let doc = "";
        if(e.target.className === "Mypin-item" || e.target.className === "pin-img") {
            console.log(e.target.parentNode);
            doc = e.target.parentNode;
        } else if(e.target.className === "pin-name" || e.target.className === "pin-title") {
            console.log(e.target.parentNode.parentNode);
            doc = e.target.parentNode.parentNode;
        } else {
            console.log(e.target.parentNode.parentNode.parentNode);
            doc = e.target.parentNode.parentNode.parentNode;
        }
        doc.querySelector(".pin-img").style.filter="grayscale(0%)";
        doc.querySelector(".noclick").classList.remove("clickPin");
    }

    const binClickHandler = () => {
        let doc = document.querySelectorAll(".noclickDel");
        for(let e of doc) {
            e.classList.toggle("clickDel");
        }
    }

    const pinDelHandler = (e) => {
        let pinId = e.target.getAttribute('id');
        e.target.src = del_check;
        // const token = cookies.get('token');
        // const response = axios.delete(`http://163.180.117.22:7218/api/pin/${pinId}`, {
        //     headers: {
        //         Authorization: "Bearer " + token
        //     }
        // })
        alert("핀이 삭제되었습니다");
        //window.reload();
    }

    const pinKeywordHandler = (e) => {
        setPinSearch(e.target.value);
    }

    const pinSearchHandler = async (e) => {
        if(e.key === 'Enter') {
            const response = await axios.get(`http://163.180.117.22:7218/api/pin/search?keyword=${pinSearch}&personaId=${activePersonaId}`);
            setAllPin(response.data);
            setViewOption(0);
        }
    }

    return (
     <>
        <div className="PinTool-container">
            <div className="LeftTool">
                <span className="all-pin" onClick={allPinHandler}>모든 PIN</span>
                <span className="pin-board" onClick={pinBoardClickHandler}>PIN Board</span>
            </div>
            <div className="RightTool">
                <input className="pin-search-input-noClick" value={pinSearch} onChange={pinKeywordHandler} onKeyPress={pinSearchHandler}></input>
                <img className="pin-search" onClick={searchBtnClickHandler} src={search}/>
                <img className="pin-add" src={plus}/>
                <img className="pin-bin" src={bin} onClick={binClickHandler}/>
            </div>
        </div>
        <div className="InsightContent-container">
            {viewOption === 0?
            <>
            <ul className="allPin-content">
                {allPin.map( pin => (
                <li className="pin-item" key={pin.id} id={pin.id}>
                    <div className="Mypin-item" onMouseOver={pinMouseOnHandler} onMouseOut={pinMouseOutHandler}>
                        <img className="pin-img" src={pin.insight.imgPath}/>
                        <div className="noclickDel">
                            <div className="pin-del-container">
                                <img className="pin-del" src={del} id={pin.id} onMouseDown={pinDelHandler}/>
                            </div>
                        </div>
                        <div className="noclick">
                            <div className="pin-edit">
                                <img className="Mypin-edit" src={edit}/>
                            </div>
                            <div className="pin-tag-container">
                                {pin.tagList.map( tag => (<span className="Mypin-tag">#{tag}&nbsp;</span>))}
                            </div>
                            <div className="pin-board-container">
                                <p className="Mypin-board">{pin.pinBoard.name}</p>
                            </div>
                        </div>
                        
                        <div className="pin-title">
                            <p className="pin-name">{pin.insight.title}</p>
                            <div className="pin-description">
                                <img className="pin-circle" src={circle}></img>
                                <span className="pin-site">{pin.insight.siteName}</span>
                            </div>
                        </div>
                    </div>
                </li>
                ))}
            </ul>
            </>:
            <>
            <ul className="pinBoard-content">
            {pinboard.map( board => (
                <li className="pinBoard" key={board.id}>
                    <img className="pinBoard-img" src={board.imgPath} width="200" height="200"/>
                    <div className="pinBoard-title">
                        <p className="pinBoard-name">{board.name}</p>
                        <p className="pinBoard-count">핀 {board.totalPinNumber}개</p>
                    </div>
                    <img className="pin-del" src={del} />
                </li>
            ))}
            </ul>
            </>}
        </div>
     </>
    );
}

export default Pinbox;