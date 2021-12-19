import { React, useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

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

    let style = {
        top: pinPosition[1],
        left: pinPosition[0]
    }

    const PinUpCloseHandler = ({ target }) => {
        console.log(target);
        if(open && !PinUp.current.contains(target) && target.className !== 'pin' && target.className !== 'PinUpClose-btn') {
            close();
        }
    }

    useEffect(() => {
        window.addEventListener('click', PinUpCloseHandler);
        return () => {
            window.removeEventListener("click", PinUpCloseHandler);
          };
    }, [open])

    const pinboardImport = async () => {
        console.log(persona)
        const token = cookies.get('token');
        const response = await axios.get(
            `http://163.180.117.22:7218/api/pin-board/?personaId=${persona}`,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                }
            );
        setPinboard(response.data);
    }
    
    const personaImgClickHandler = (e) => {
        setPersona(e.target.getAttribute("value"));
        // setClickPersonaImg(e.target.getAttribute("src"))
        console.log(e.target.getAttribute("src"));
        console.log(e.target.getAttribute("value"));
        const persona_img = document.querySelectorAll('.persona-img');
        for(var i=0;i<persona_img.length;i++) {
            persona_img[i].classList.remove('clickedPersona');
        }
        e.target.classList.add('clickedPersona');
    }

    useEffect(() => {
        setPersona(personaId);
        if(personaImg.length===3) {
            setClickPersonaImg(personaImg[0].profileImgPath);
            console.log(personaImg[0].profileImgPath);
        }
    }, [open, personaImg])

    useEffect(() => {
        pinboardImport();
    }, [persona, pinBoardName])

    const pinboardChangeHandler = (e) => {
        setPinInputValue(e.target.value);
    }

    const pinboardCreateClickHandler = async () => {
        const token = cookies.get('token');
        const response = await axios.post(
            'http://163.180.117.22:7218/api/pin-board',
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
        console.log(pageNum);
        const token = cookies.get('token');
        if(pageNum < 2) {
            setPageNum(pageNum+1);
            if(pageNum == 1) {
                await axios.post('http://163.180.117.22:7218/api/pin/up', {
                        "insightId": insightId,
                        "pinBoardId": pinBoardId
                },
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                });
            }
        } else {
            setPageNum(2);
        }
    }

    const closeBtnClickHandler = () => {
        close();
        window.location.reload();
    }

    const pinBoardGoClickHandler = () => {
        window.location.replace('/mypage');
    }

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
                        <p className="pinboard" id={pin.id} onClick={pinboadClickHandler}>{pin.name}</p>
                    ))}
                </div>
                <div className="PinboardInput-container">
                    <input className="pinboard-input" value={pinInputValue} onChange={pinboardChangeHandler} placeholder="새 핀보드명을 입력해주세요." />
                    <button className="pinboard-btn" onClick={pinboardCreateClickHandler}>추가</button>
                </div>
                <div className="PinUpClose-container">
                    <button className="PinUpClose-btn" onClick={nextPageHandler}>다음</button>
                </div>
            </div>
            );
        } else if (pageNum === 2) {
            return (
            <div className="Pinup-container2" ref={PinUp} style={style}>
                <div className="header-container">
                    <img className="header" src={prev}/>
                </div>
                <div className="persona-container">
                    <img className="persona" src={clickPersonaImg}/>
                </div>
                <div className="pinBoard-container">
                    <p className="pinBoard">{pinBoardName}</p>
                    <p className="pinBoardComment">에 저장 했어요 !</p>
                </div>
                <div className="pinBoardBTN-container">
                    <span className="pinBoardBTN" onClick={pinBoardGoClickHandler}>핀 보드로 바로 가기</span>
                    <button className="closeBTN" onClick={closeBtnClickHandler}>다음</button>
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
    //                 <input className="pinboard-input" value={pinInputValue} onChange={pinboardChangeHandler} placeholder="새 핀보드명을 입력해주세요." />
    //                 <button className="pinboard-btn" onClick={pinboardCreateClickHandler}>추가</button>
    //             </div>
    //             <div className="PinUpClose-container">
    //                 <button className="PinUpClose-btn" onClick={nextPageHandler}>다음</button>
    //             </div>
    //         </div>
    //         </>:pageNum === 2?
    //         <>
    //             <div className="Pinup-container" width="321px" height="273px"ref={PinUp} style={style} style={style}>
    //                 <div>인사이트 추가</div>
    //                 <input placeholder="url을 입력해주세요" />
    //                 <button>다음</button>
    //             </div>
    //         </>
    //         :null}
    //         </>
    //     ):null}
    //     </>
    // );
}

export default PinUP;

// if(pageNum === 1) {
    //     return (
    //         <div className="Pinup-container">
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
    //                 <input className="pinboard-input" value={pinInputValue} onChange={pinboardChangeHandler} placeholder="새 핀보드명을 입력해주세요." />
    //                 <button className="pinboard-btn" onClick={pinboardCreateClickHandler}></button>
    //             </div>
    //         </div>
    //     );
    // } else if(pageNum === 2) {
    //     return (
    //         <div className="Pinup-container">
    //             <div>인사이트 추가</div>
    //             <input placeholder="url을 입력해주세요" />
    //             <button>다음</button>
    //         </div>
    //     );
    // }