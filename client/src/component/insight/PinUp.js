import { React, useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

import Create from "./Create";

import "../../assets/css/modal/PinEditModal.css";
import prev from "../../assets/svg/prev.svg";

function PinUP(props) {
    const cookies = new Cookies();

    const PinUp = useRef();

    const {open, pageNum, setPageNum, close, header, personaImg, personaId, insightId, pinPosition} = props;
    const [pinboard, setPinboard] = useState([]);
    const [persona, setPersona] = useState(personaId);
    const [pinInputValue, setPinInputValue] = useState("");
    const [pinBoardId, setPinBoardId] = useState(0);
    const [pinBoardName, setPinBoardName] = useState("");
    const [clickPersonaImg, setClickPersonaImg] = useState("");
    const [prevImgUrl, setPrevImgUrl] = useState("");
    const [ChangeImgFormdata, setChangeImgFormdata] = useState(null);
    const [newPinId, setNewPinId] = useState(0);

    let style = {
        top: pinPosition[1],
        left: pinPosition[0]
    }

    const PinUpCloseHandler = ({ target }) => {
        if(target.className !== 'complete-btn' && target.className !== 'prev') {
            if(open && !PinUp.current.contains(target) && target.className !== 'pin' && target.className !== 'PinUpClose-btn') {
                setPageNum(1);
                setPinBoardId(0);
                setPinInputValue("");
                close();
            }
        }
    }

    useEffect(() => {
        window.addEventListener('click', PinUpCloseHandler);
        return () => {
            window.removeEventListener("click", PinUpCloseHandler);
          };
    }, [open])

    const pinboardImport = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${process.env.REACT_APP_SERVER_HOST}/api/pin-board/?personaId=${persona}`,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                }
            );
        setPinboard(response.data);
    }
    
    const personaImgClickHandler = (e) => {
        setPinBoardId(0);
        setPersona(e.target.getAttribute("value"));
        const persona_img = document.querySelectorAll('.persona-img');
        for(var i=0;i<persona_img.length;i++) {
            persona_img[i].classList.remove('clickedPersona');
        }
        e.target.classList.add('clickedPersona');
        if(e.target.getAttribute("value")!== persona && document.querySelectorAll('.pinboard')) {
            const pinBoard = document.querySelectorAll('.pinboard');
            for(var i=0;i<pinBoard.length;i++) {
                pinBoard[i].classList.remove('clickedPinBoard');
            }
        }
    }

    useEffect(() => {
        setPersona(personaId);
        const persona_img = document.querySelectorAll('.persona-img');
        if(open && persona_img[0]!==undefined) {
            setClickPersonaImg(personaImg[0].profileImgPath);
            persona_img[0].classList.add('clickedPersona');
        }
    }, [open, personaImg])

    useEffect(() => {
        pinboardImport();
    }, [persona, pinBoardName])

    const pinboardChangeHandler = (e) => {
        setPinInputValue(e.target.value);
    }

    const pinboardCreateClickHandler = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            process.env.REACT_APP_SERVER_HOST + '/api/pin-board',
            {
                "name": pinInputValue,
                "personaId": persona
              }
            ,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                }
            );
            setPinBoardName(pinInputValue);
            setPinInputValue("");
    }

    const pinboardCreateSubmitHandler = async (e) => {
        if(e.key === 'Enter') {
            console.log(persona)
            const token = localStorage.getItem('token');
            if(pinInputValue !== "" && persona !== undefined) {
                const response = await axios.post(
                    process.env.REACT_APP_SERVER_HOST + '/api/pin-board',
                    {
                        "name": pinInputValue,
                        "personaId": persona
                    }
                    ,
                        {
                            headers: {
                                Authorization: "Bearer " + token,
                            }
                        }
                    );
                    setPinBoardName(pinInputValue);
                    setPinInputValue("");
            } else {
                console.log('?????? ??????????????? ???????????????');
            }
        }
    }

    const pinboadClickHandler = async (e) => {
        setPinBoardId(e.target.getAttribute('id'));
        setPinBoardName(e.target.innerHTML);
        const pinBoard = document.querySelectorAll('.pinboard');
        for(var i=0;i<pinBoard.length;i++) {
            pinBoard[i].classList.remove('clickedPinBoard');
        }
        e.target.classList.add('clickedPinBoard');
    }

    const nextPageHandler = async () => {
        const token = localStorage.getItem('token');
        if(pageNum < 2) {
            setPageNum(pageNum+1);
            if(pageNum === 1) {
                if(pinBoardId !== 0) {
                    const response = await axios.post(process.env.REACT_APP_SERVER_HOST + '/api/pin/up', {
                            "insightId": insightId,
                            "pinBoardId": pinBoardId
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + token,
                        }
                    });
                    setNewPinId(response.data);
                } else {
                    setPageNum(1);
                }
            }
        } else {
            if(ChangeImgFormdata !== null) {
                const response = await axios.post(`${process.env.REACT_APP_SERVER_HOST}/api/pin/image/${newPinId}`, ChangeImgFormdata);
            }
            setPinBoardId(0);
            setPageNum(1);
            setPinInputValue("");
            close();
        }
    }

    const onPrevHandler=() => {
        if(pageNum > 1) {
            setPageNum(pageNum-1);
        } else {
            setPageNum(1);
        }
    }

    async function readImage (e) {
        var formData = new FormData();
        formData.append('pinImg', e.target.files[0]);
        setChangeImgFormdata(formData);
        const reader = new FileReader();
        setPrevImgUrl(URL.createObjectURL(e.target.files[0]));
        reader.readAsDataURL(e.target.files[0]);
    }

    useEffect( async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/insight/${insightId}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        setPrevImgUrl(response.data.imgPath);
    }, [insightId]);

    useEffect(() => {
        const previewImage = document.getElementsByClassName("upload-file");
        previewImage.src = prevImgUrl.substring(5);
    }, [prevImgUrl]);

    useEffect(() => {
        if(pageNum === 1) {
            if(document.querySelector('.PinUpClose-btn') && pinBoardId === 0) {
                document.querySelector('.PinUpClose-btn').classList.add('noPlayBtn');
            } else if (pinBoardId !== 0) {
                document.querySelector('.PinUpClose-btn').classList.remove('noPlayBtn');
            }
        }
    }, [open, pageNum, pinBoardId]);

    if(open) {
        if(pageNum === 1) {
            return (
            <div className="Pinup-container" ref={PinUp} style={style}>
                <div className="PersonaImg-container">
                    {personaImg.map(i => (
                        <img className="persona-img" value={i.id} src={i.profileImgPath} width="200" height="200" onClick={personaImgClickHandler}></img>
                    ))}
                </div>
                <div className="Pinboard-container">
                    {pinboard.map( pin => (
                        <div className="pinboard" id={pin.id} onClick={pinboadClickHandler}>{pin.name}</div>
                    ))}
                </div>
                <div className="PinboardInput-container">
                    <input className="pinboard-input" value={pinInputValue} onChange={pinboardChangeHandler} onKeyPress={pinboardCreateSubmitHandler} placeholder="??? ??????????????? ??????????????????." />
                    <button className="pinboard-btn" onClick={pinboardCreateClickHandler}>??????</button>
                </div>
                <div className="PinUpClose-container">
                    <button className="PinUpClose-btn" onClick={nextPageHandler}>??????</button>
                </div>
            </div>
            );
        } else if (pageNum === 2) {
            return (
            <div className="Pinup-container" ref={PinUp} style={style}>
                <img className="prev" src={prev} onClick={onPrevHandler}/>
                <div className="complete-title">???????????? ?????? ??????!</div>
                    <div className="complete-description">????????? ??????????????? ??????????????? ??? ????????? ??? ?????????:)</div>
                    <div className="filebox">
                        <img className="upload-file" value="Thumbnail" src={prevImgUrl}/>
                        <label for="file">????????? ????????? ??????</label> 
                        <input type="file" id="file" onChange={readImage}/>
                    </div>
                    <div className="completeBtn-container">
                        <button className="complete-btn" onClick={nextPageHandler}>??????</button>
                    </div>
            </div>
            );
        } 
    } else {
        return(
            null
        );
    }

    // return(
    //   <>
    //     {open? (
    //         <>
    //         {pageNum === 1?
    //         <>
    //         <div className="Pinup-container" height="420px" width="321px" ref={PinUp} style={style}>
    //             <div className="PersonaImg-container">
    //                 {personaImg.map(i => (
    //                     <img className="persona-img" value={i.id} src={i.profileImgPath} width="200" height="200" onClick={personaImgClickHandler}></img>
    //                 ))}
    //             </div>
    //             <div className="Pinboard-container">
    //                 {pinboard.map( pin => (
    //                     <p className="pinboard" id={pin.id} onClick={pinboadClickHandler}>{pin.name}</p>
    //                 ))}
    //             </div>
    //             <div className="PinboardInput-container">
    //                 <input className="pinboard-input" value={pinInputValue} onChange={pinboardChangeHandler} placeholder="??? ??????????????? ??????????????????." />
    //                 <button className="pinboard-btn" onClick={pinboardCreateClickHandler}>??????</button>
    //             </div>
    //             <div className="PinUpClose-container">
    //                 <button className="PinUpClose-btn" onClick={nextPageHandler}>??????</button>
    //             </div>
    //         </div>
    //         </>:pageNum === 2?
    //         <>
    //             <div className="Pinup-container" width="321px" height="273px"ref={PinUp} style={style} style={style}>
    //                 <div>???????????? ??????</div>
    //                 <input placeholder="url??? ??????????????????" />
    //                 <button>??????</button>
    //             </div>
    //         </>
    //         :null}
    //         </>
    //     ):null}
    //     </>
    // );
}

export default PinUP;
