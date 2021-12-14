import { React, useState, useEffect, useRef } from "react";
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

import PinEdit from "./PinEdit";
import PinAdd from "./PinAdd";
import PinBoardAdd from "./PinBoardAdd";

function Pinbox(props) {
    const cookies = new Cookies;

    const {activePersonaId, setEditTrue, setEditClickTrue, EditModalClose} = props;

    const [pinboard, setPinboard] = useState([]);
    const [allPin, setAllPin] = useState([]);
    // const [pinboardId, setPinboardId] = useState(0);
    const [viewOption, setViewOption] = useState(0);
    const [pinSearch, setPinSearch] = useState("");
    const [clickedPin, setClickedPin] = useState();
    const [editPosition, setEditPosition] = useState([]);
    const [pins, setPins] = useState([]);

    //modal...
    const [pinEditModalOpen, setPinEditModalOpen] = useState(false);
    const openEditModal = () => {
        setPinEditModalOpen(true);
    }
    const closeEditModal = () => {
        setPinEditModalOpen(false);
        window.location.reload();
    }
    //...modal
     //modal2...
     const [pinAddModalOpen, setPinAddModalOpen] = useState(false);
     const openAddModal = () => {
         setPinAddModalOpen(true);
     }
     const closeAddModal = () => {
         setPinAddModalOpen(false);
     }
     //...modal2
    //modal3...
    const [pinBoardAddModalOpen, setPinBoardAddModalOpen] = useState(false);
    const openPinBoardAddModal = () => {
        setPinBoardAddModalOpen(true);
    }
    const closePinBoardAddModal = () => {
        setPinBoardAddModalOpen(false);
    }
    //...modal3

    const PinBoardImport = async () => {
        const token = cookies.get('token');
        const response = await axios.get(`http://163.180.117.22:7218/api/pin-board/?personaId=${activePersonaId}`,{
            headers: {
                Authorization: "Bearer " + token
            }
        });
        setPinboard(response.data);
    }

    const pinBoardClickHandler = async () => {
        await PinBoardImport();
        setViewOption(1);
        document.querySelector(".noPinItem").classList.remove("pinItem-content");
        console.log(document.querySelector(".pinBoard-content"))
        document.querySelector(".pinBoard-content").classList.remove("noPinBoard");
        document.querySelector(".pin-board-name").style.display="none";
        const pinBoardElement = document.querySelector(".pinBoardElement-name");
        document.querySelector(".pin-board-name").removeChild(pinBoardElement);
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
            document.querySelector(".all-pin").style.color = "#FE3400";
            document.querySelector(".pin-board").style.color = "#BEBBB9";
        } else if(viewOption === 1) {
            pinBoardClickHandler();
            document.querySelector(".all-pin").style.color = "#BEBBB9";
            document.querySelector(".pin-board").style.color = "#FE3400";
        }
        PinBoardImport();
    }, [activePersonaId, viewOption]);

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

    const pinClickHandler = async (e) => {
        const token = cookies.get('token');
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
        const pinId = doc.getAttribute("id");
        const response = await axios.get(`http://163.180.117.22:7218/api/pin/${pinId}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        window.open(response.data.insight.url);
    }

    const pinDelHandler = (e) => {
        let pinId = e.target.getAttribute('id');
        const token = cookies.get('token');
        const response = axios.delete(`http://163.180.117.22:7218/api/pin/${pinId}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        alert(pinId + "핀이 삭제되었습니다");
        window.location.reload();
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

    const pinEditHandler = async (e) => {
        e.stopPropagation();
        const token = cookies.get('token');
        const pinId = e.target.getAttribute('id');
        const response = await axios.get(`http://163.180.117.22:7218/api/pin/${pinId}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        setClickedPin(response.data);
        openEditModal();
        console.log(e);
        setEditPosition([e.pageX-280, e.pageY+21]);
        setEditClickTrue(false);
    }

    useEffect(() => {
        if(EditModalClose) {
            setPinEditModalOpen(false);
        }
    }, [EditModalClose]);

    const pinAddClickHandler = async () => {
        if(viewOption === 0) {
            openAddModal();
        } else if(viewOption === 1) {
            openPinBoardAddModal();
        }
    }

    const pinBoardItemClickHandler = async (e) => {
        const token = cookies.get('token');
        const pinBoardId = e.currentTarget.getAttribute("id");
        const response = await axios.get(`http://163.180.117.22:7218/api/pin/pin-board/${pinBoardId}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        setPins(response.data);
        document.querySelector(".noPinItem").classList.add("pinItem-content");
        document.querySelector(".pinBoard-content").classList.add("noPinBoard");
        document.querySelector(".pin-board-name").style.display="flex";
        const pinBoardName = document.createElement('div');
        pinBoardName.className = "pinBoardElement-name";
        pinBoardName.innerHTML = response.data[0].pinBoard.name;
        document.querySelector(".pin-board-name").appendChild(pinBoardName);
    };

    return (
     <>
        <div className="PinTool-container" >
            <div className="LeftTool">
                <span className="all-pin" onClick={allPinHandler}>모든 PIN</span>
                <span className="pin-board" onClick={pinBoardClickHandler}>PIN Board</span>
                <div className="pin-board-name"></div>
            </div>
            <div className="RightTool">
                <input className="pin-search-input-noClick" value={pinSearch} onChange={pinKeywordHandler} onKeyPress={pinSearchHandler}></input>
                <img className="pin-search" onClick={searchBtnClickHandler} src={search}/>
                <img className="pin-add" src={plus} onClick={pinAddClickHandler}/>
                <PinAdd pinAddModalOpen={pinAddModalOpen} closeAddModal={closeAddModal} pinboard={pinboard}/>
                <PinBoardAdd pinBoardAddModalOpen={pinBoardAddModalOpen} closePinBoardAddModal={closePinBoardAddModal} activePersonaId={activePersonaId}/>
            </div>
        </div>
        <div className="InsightContent-container">
            {viewOption === 0?
            <>
            <ul className="allPin-content">
                {allPin.map( pin => (
                <li className="pin-item" key={pin.id} id={pin.id}>
                    <div className="Mypin-item" id={pin.id} onMouseOver={pinMouseOnHandler} onMouseOut={pinMouseOutHandler} onMouseDown={pinClickHandler}>
                        <img className="pin-img" src={pin.insight.imgPath}/>
                        
                        <div className="noclick">
                            <div className="pin-edit-del">
                                <img className="Mypin-edit" src={edit} id={pin.id} onMouseDown={pinEditHandler}/>
                                <img className="pin-del" src={bin} id={pin.id} onMouseDown={pinDelHandler}/>
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
                <PinEdit pinEditModalOpen={pinEditModalOpen} close={closeEditModal} clickedPin={clickedPin} editPosition={editPosition} setEditTrue={setEditTrue} setEditClickTrue={setEditClickTrue} />
            </ul>
            </>:
            <>
            <ul className="pinBoard-content">
            {pinboard.map( board => (
                <li className="pinBoard" key={board.id}>
                    <div lassName="pinBoardItem-container" id={board.id} onClick={pinBoardItemClickHandler}>
                        <img className="pinBoard-img" src={board.imgPath} width="200" height="200"/>
                        <div className="pinBoard-title">
                            <p className="pinBoard-name">{board.name}</p>
                            <p className="pinBoard-count">핀 {board.totalPinNumber}개</p>
                        </div>
                    </div>
                    <img className="pin-del" src={del} />
                </li>
            ))}
            </ul>
            </>}
            <ul className="noPinItem">
                {pins.map( pin => (
                <li className="pin-item" key={pin.id} id={pin.id}>
                    <div className="Mypin-item" id={pin.id} onMouseOver={pinMouseOnHandler} onMouseOut={pinMouseOutHandler} onMouseDown={pinClickHandler}>
                        <img className="pin-img" src={pin.insight.imgPath}/>
                        
                        <div className="noclick">
                            <div className="pin-edit-del">
                                <img className="Mypin-edit" src={edit} id={pin.id} onMouseDown={pinEditHandler}/>
                                <img className="pin-del" src={bin} id={pin.id} onMouseDown={pinDelHandler}/>
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
                <PinEdit pinEditModalOpen={pinEditModalOpen} close={closeEditModal} clickedPin={clickedPin} editPosition={editPosition} setEditTrue={setEditTrue} setEditClickTrue={setEditClickTrue} />
            </ul>
        </div>
     </>
    );
}

export default Pinbox;