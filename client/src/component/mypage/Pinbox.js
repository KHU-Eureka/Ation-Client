import { React, useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

import "../../assets/css/mypage/pinbox.css";
import plus from "../../assets/svg/plus.svg";
import search from "../../assets/svg/search.svg";
import bin from "../../assets/svg/bin.svg";
import circle from "../../assets/svg/circle.svg";
import edit from "../../assets/svg/edit.svg";

import PinEdit from "./PinEdit";
import PinAdd from "./PinAdd";
import PinBoardAdd from "./PinBoardAdd";
import PinBoardEdit from "./PinBoardEdit";
import Delete from "./Delete";

function Pinbox(props) {
    const cookies = new Cookies;

    const {activePersonaId} = props;

    const [pinboard, setPinboard] = useState([]);
    const [allPin, setAllPin] = useState([]);
    const [viewOption, setViewOption] = useState(0);
    const [pinSearch, setPinSearch] = useState("");
    const [clickedPin, setClickedPin] = useState();
    const [clickedPinBoardID, setClickedPinBoardID] = useState(0);
    const [editPosition, setEditPosition] = useState([]);
    const [BoardEditPosition, setBoardEditPosition] = useState([]);
    const [pins, setPins] = useState([]);
    const [deletePinId, setDeletePinId] = useState(0);
    const [deletePinBoardId, setDeletePinBoardId] = useState(0);
    const [searchTrue, setSearchTrue] = useState(false);
    const [addTrue, setAddTrue] = useState(false);

    //modal...
    const [pinEditModalOpen, setPinEditModalOpen] = useState(false);
    const openEditModal = () => {
        setPinEditModalOpen(true);
    }
    const closeEditModal = () => {
        setPinEditModalOpen(false);
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
    //modal4...
    const [pinBoardEditModalOpen, setPinBoardEditModalOpen] = useState(false);
    const openPinBoardEditModal = () => {
        setPinBoardEditModalOpen(true);
    }
    const closePinBoardEditModal = () => {
        setPinBoardEditModalOpen(false);
    }
    //...modal4
    //modal5...
    const [pinEditModal2Open, setPinEdit2ModalOpen] = useState(false);
    const openPinEditModal2 = () => {
        setPinEdit2ModalOpen(true);
    }
    const closePinEditModal2 = () => {
        setPinEdit2ModalOpen(false);
    }
    //...modal5
    //modal6...
    const [DeleteOpen, setDeleteOpen] = useState(false);
    const openDeleteModal = () => {
        setDeleteOpen(true);
    }
    const closeDeleteModal = () => {
        setDeleteOpen(false);
    }
    //...modal6
    //modal7...
    const [DeleteBoardOpen, setDeleteBoardOpen] = useState(false);
    const openDeleteBoardModal = () => {
        setDeleteBoardOpen(true);
    }
    const closeDeleteBoardModal = () => {
        setDeleteBoardOpen(false);
    }
    //...modal7

    const PinBoardImport = async () => {
        const token = cookies.get('token');
        const response = await axios.get(process.env.REACT_APP_SERVER_HOST + `/api/pin-board/?personaId=${activePersonaId}`,{
            headers: {
                Authorization: "Bearer " + token
            }
        });
        setPinboard(response.data);
    }

    const pinBoardClickHandler = async () => {
        await PinBoardImport();
        setViewOption(1);
        document.querySelector(".pinBoard-content").style.display="flex";
        setPins([]);
        document.querySelector(".pin-board-name").style.display="none";
        document.querySelector(".pinItem-content").style.display="none";
        setSearchTrue(false);
    }

    const allPinHandler = async () => {
        const token = cookies.get('token');
        if(searchTrue) {
            try {
                const response = await axios.get(process.env.REACT_APP_SERVER_HOST + `/api/pin/search?keyword=${pinSearch}&personaId=${activePersonaId}`);
                setAllPin(response.data);
            } catch(err) {
                // setSearchTrue(false);
                console.log(err);
            }
        } else {
            const response = await axios.get(process.env.REACT_APP_SERVER_HOST + `/api/pin?personaId=${activePersonaId}`,{
                headers: {
                    Authorization: "Bearer " + token
                }
            });
            setAllPin(response.data);
        }
        setViewOption(0);
    }

    useEffect(() => {
        document.querySelector(".pin-board-name").style.display="none";
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
    }, [activePersonaId, viewOption, searchTrue]);

    const searchBtnClickHandler = async () => {
        const response = await axios.get(process.env.REACT_APP_SERVER_HOST + `/api/pin/search?keyword=${pinSearch}&personaId=${activePersonaId}`);
        setAllPin(response.data);
        setViewOption(0);
        setSearchTrue(true);
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
            } else if(e.target.className === 'Mypin-tag') {
                doc = e.target.parentNode.parentNode.parentNode.parentNode;
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
        } else if(e.target.className === 'Mypin-tag') {
            doc = e.target.parentNode.parentNode.parentNode.parentNode;
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
        const response = await axios.get(process.env.REACT_APP_SERVER_HOST + `/api/pin/${pinId}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        window.open(response.data.insight.url);
    }

    const pinDelHandler = (e) => {
        e.stopPropagation();
        let pinId = e.target.getAttribute('id');
        setDeletePinId(pinId);
        openDeleteModal();
    }

    const pinKeywordHandler = (e) => {
        setPinSearch(e.target.value);
    }

    const pinSearchHandler = async (e) => {
        if(e.key === 'Enter') {
            const token = cookies.get('token');
            const response = await axios.get(process.env.REACT_APP_SERVER_HOST + `/api/pin/search?keyword=${pinSearch}&personaId=${activePersonaId}`, {
                headers: {
                    Authorization: "Bearer " + token
                }
            });
            setAllPin(response.data);
            setViewOption(0);
            setSearchTrue(true);
        }
    }

    const pinEditHandler = async (e) => {
        e.stopPropagation();
        console.log(e.target);
        const token = cookies.get('token');
        const pinId = e.target.getAttribute('id');
        const response = await axios.get(process.env.REACT_APP_SERVER_HOST + `/api/pin/${pinId}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        setClickedPin(response.data);
        setEditPosition([e.pageX-280, e.pageY+30]);
        openEditModal();
    }

    const pinAddClickHandler = async () => {
        if(viewOption === 0) {
            openAddModal();
        } else if(viewOption === 1) {
            openPinBoardAddModal();
        }
    }

    const pinBoardItemClickHandler = async (e) => {
        if(e.target.className!=='Mypin-edit2' && e.target.className!=='pin-del2') {
            const token = cookies.get('token');
            const pinBoardId = e.currentTarget.getAttribute("id");
            document.querySelector(".pin-board-name").style.display="flex";
            document.querySelector(".pin-board-name").innerHTML = e.currentTarget.querySelector(".pinBoard-name").innerHTML;
            const response = await axios.get(process.env.REACT_APP_SERVER_HOST + `/api/pin/pin-board/${pinBoardId}`, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            setPins(response.data);
            document.querySelector(".pinBoard-content").style.display="none";
            document.querySelector(".pinItem-content").style.display="flex";
        }
    };

    const pinBoardItemHoverHandler = (e) => {
        const img_tag = e.currentTarget.querySelector(".pinBoard-img");
        img_tag.style.filter = "grayscale(60%)";
        e.currentTarget.querySelector(".noClickPinBoard").classList.add("pin-edit-del2");
    }

    const pinBoardItemHoverOutHandler = (e) => {
        const img_tag = e.currentTarget.querySelector(".pinBoard-img");
        img_tag.style.filter = "grayscale(0%)";
        e.currentTarget.querySelector(".noClickPinBoard").classList.remove("pin-edit-del2");
    }

    const pinBoardEditHandler = async (e) => {
        e.stopPropagation();
        setClickedPinBoardID(e.target.getAttribute("id"));
        setBoardEditPosition([e.pageX-280, e.pageY+30]);
        openPinBoardEditModal();
    }

    const pinBoardDelHandler = async (e) => {
        e.stopPropagation();
        const pinBoardId = e.target.getAttribute('id');
        setDeletePinBoardId(pinBoardId);
        openDeleteBoardModal();
    }

    useEffect(() => {
        if(addTrue) {
            PinBoardImport();
            setAddTrue(false);
        }
    }, [addTrue])

    return (
     <>
        <div className="PinTool-container" >
            <div className="LeftTool">
                <span className="all-pin" onClick={searchTrue?() => {window.location.reload();window.scrollTop = window.scrollTo(0,0);}:allPinHandler}>모든 PIN</span>
                <span className="pin-board" onClick={pinBoardClickHandler}>PIN Board
                    <div className="pin-board-name"></div>
                </span>
            </div>
            <div className="RightTool">
                <input className="pin-search-input" value={pinSearch} onChange={pinKeywordHandler} onKeyPress={pinSearchHandler} placeholder="찾고싶은 핀을 검색해보세요!"></input>
                <div className="pin-searchImg-container">
                    <img className="pin-search" onClick={searchBtnClickHandler} src={search}/>
                </div>
                <img className="pin-add" src={plus} onClick={pinAddClickHandler}/>
                <PinAdd pinAddModalOpen={pinAddModalOpen} closeAddModal={closeAddModal} activePersonaId={activePersonaId}/>
                <PinBoardAdd pinBoardAddModalOpen={pinBoardAddModalOpen} closePinBoardAddModal={closePinBoardAddModal} activePersonaId={activePersonaId} setAddTrue={setAddTrue}/>
            </div>
        </div>
        <div className="InsightContent-container">
            {viewOption === 0?
            <div>
            <ul className="allPin-content">
                {allPin.map( pin => (
                <li className="pin-item" key={pin.id} id={pin.id}>
                    <div className="Mypin-item" id={pin.id} onMouseOver={pinMouseOnHandler} onMouseOut={pinMouseOutHandler} onMouseDown={pinClickHandler}>
                        <img className="pin-img" src={pin.pinImgPath}/>
                        
                        <div className="noclick">
                            <div className="pin-edit-del">
                                <img className="Mypin-edit" src={edit} id={pin.id} onMouseDown={pinEditHandler}/>
                                <img className="pin-del" src={bin} id={pin.id} onMouseDown={pinDelHandler}/>
                            </div>
                           
                            <div className="pin-tag-board-container">
                                <div className="pin-tag-container">
                                    {pin.tagList.map( tag => (<span className="Mypin-tag">#{tag}&nbsp;</span>))}
                                </div>
                                <p className="Mypin-board">{pin.pinBoard.name}</p>
                            </div>
                        </div>
                        <div className="pin-title">
                            <p className="pin-name">{pin.insight.title}</p>
                            <div className="pin-description">
                                <img className="pin-circle" src={pin.insight.icon}></img>
                                <span className="pin-site">{pin.insight.siteName}</span>
                            </div>
                        </div>
                    </div>
                </li>
                ))}
                <PinEdit pinEditModalOpen={pinEditModalOpen} closeEditModal={closeEditModal} clickedPin={clickedPin} editPosition={editPosition}/>
                <Delete DeleteOpen={DeleteOpen} closeDeleteModal={closeDeleteModal} title={'핀 카드'} description={'카드'} deletePinId={deletePinId}/>
            </ul>
            </div>:
            <>
            <ul className="pinBoard-content">
            {pinboard.map( board => (
                <li className="pinBoard" key={board.id}>
                    <div lassName="pinBoardItem-container" id={board.id} onClick={pinBoardItemClickHandler} onMouseOver={pinBoardItemHoverHandler} onMouseOut={pinBoardItemHoverOutHandler}>
                        <img className="pinBoard-img" src={board.imgPath} width="200" height="200"/>
                        <div className="pinBoard-title">
                            <p className="pinBoard-name">{board.name}</p>
                            <p className="pinBoard-count">핀 {board.totalPinNumber}개</p>
                        </div>
                        {/* 핀보드의 수정 삭제*/}
                        <div className="noClickPinBoard" id={board.id}>
                            <img className="Mypin-edit2" src={edit} id={board.id} onMouseDown={pinBoardEditHandler}/>
                            <img className="pin-del2" src={bin} id={board.id} onMouseDown={pinBoardDelHandler}/>
                        </div>
                    </div>
                </li>
            ))}
            </ul>
            <PinBoardEdit pinBoardEditModalOpen={pinBoardEditModalOpen} closePinBoardEditModal={closePinBoardEditModal} BoardEditPosition={BoardEditPosition} clickedPinBoardID={clickedPinBoardID} setAddTrue={setAddTrue}/>
            <Delete DeleteOpen={DeleteBoardOpen} closeDeleteModal={closeDeleteBoardModal} title={'핀보드'} description={'보드'} deletePinId={deletePinBoardId} setAddTrue={setAddTrue}/>
            <ul className="pinItem-content">
                {pins.length!==0?pins.map( pin => (
                <li className="pin-item" key={pin.id} id={pin.id}>
                    <div className="Mypin-item" id={pin.id} onMouseOver={pinMouseOnHandler} onMouseOut={pinMouseOutHandler} onMouseDown={pinClickHandler}>
                        <img className="pin-img" src={pin.pinImgPath}/>
                        <div className="noclick">
                            <div className="pin-edit-del">
                                <img className="Mypin-edit" src={edit} id={pin.id} onMouseDown={pinEditHandler}/>
                                <img className="pin-del" src={bin} id={pin.id} onMouseDown={pinDelHandler}/>
                            </div>
                            <div className="pin-tag-board-container">
                                <div className="pin-tag-container">
                                    {pin.tagList.map( tag => (<span className="Mypin-tag">#{tag}&nbsp;</span>))}
                                </div>
                                <p className="Mypin-board">{pin.pinBoard.name}</p>
                            </div>
                        </div>
                        
                        <div className="pin-title">
                            <p className="pin-name">{pin.insight.title}</p>
                            <div className="pin-description">
                                <img className="pin-circle" src={pin.insight.icon}></img>
                                <span className="pin-site">{pin.insight.siteName}</span>
                            </div>
                        </div>
                    </div>
                </li>
                )):
                <div className="noPinsPinBoard">
                    아직 핀이 존재하지 않아요!
                </div>}
                <PinEdit pinEditModalOpen={pinEditModalOpen} closeEditModal={closeEditModal} clickedPin={clickedPin} editPosition={editPosition}/>
                <Delete DeleteOpen={DeleteOpen} closeDeleteModal={closeDeleteModal} title={'인사이트 카드'} description={'카드'} deletePinId={deletePinId}/>
            </ul>
            </>}
        </div>
     </>
    );
}

export default Pinbox;