import { React, useState, useEffect, useRef, useCallback } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

import "../../assets/css/mypage/PinAdd.css";
import prev from "../../assets/svg/prev.svg";
import fail_logo from "../../assets/svg/fail_logo.svg";

function PinAdd(props) {
    const cookies = new Cookies;
    const modalAdd = useRef();
    const {pinAddModalOpen, closeAddModal, activePersonaId} = props;

    const [personas, setPersonas] = useState([]);
    const [pinboards, setPinboards] = useState([]);
    const [clickedPersonaId, setClickedPersonaId] = useState(0);
    const [pageNum, setPageNum] = useState(1);
    const [urlValue, setUrlValue] = useState("");
    const [pinBoardInputValue, setPinBoardInputValue] = useState("");
    const [pinBoardId, setPinBoardId] = useState(0);
    const [tagList, setTagList] = useState([]);
    const [tagValue, setTagValue] = useState("");
    const [newPinId, setNewPinId] = useState(0);
    const [prevImgUrl, setPrevImgUrl] = useState("");
    const [ChangeImgFormdata, setChangeImgFormdata] = useState(null);
    const [pinBoardName, setPinBoardName] = useState("");
    const [urlTrue, setUrlTrue] = useState(false);
    const [pinAddTrue, setPinAddTrue] = useState(0);

    const PinAddModalCloseHandler = ({ target }) => {
        if(target.className !== 'prev-img' && !target.classList.contains('next-btn') && target.className !== 'tag') {
            if (pinAddModalOpen && !modalAdd.current.contains(target) && target.className !== 'skip-btn') {
                setUrlValue("");
                setPageNum(1);
                setTagList([]);
                setTagValue("");
                setPinBoardId(0);
                setPinBoardInputValue("");
                setUrlTrue(false);
                setPinAddTrue(0);
                closeAddModal();
            }
        }
      };

    useEffect(() => {
        window.addEventListener("click", PinAddModalCloseHandler);
        return () => {
          window.removeEventListener("click", PinAddModalCloseHandler);
        };
    }, [pinAddModalOpen]);

    const PersonaSetting = async () => {
        const token = cookies.get('token');
        const response = await axios.get(
            process.env.REACT_APP_SERVER_HOST + '/api/persona',
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
          );
        const response2 = await axios.get(
            process.env.REACT_APP_SERVER_HOST + '/api/persona/user', 
            {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        setClickedPersonaId(response2.data.id);
        for(var i of response.data) {
            if(i.id === response2.data.id) {
                setPersonas([i]);
            } 
        }
        for(var i of response.data) {
            if(i.id !== response2.data.id) {
                setPersonas(prev => [...prev, i]);
            } 
        }
    }

    const pinboardImport = async () => {
        if(clickedPersonaId !== null) {
            const token = cookies.get('token');
            const response = await axios.get(process.env.REACT_APP_SERVER_HOST + `/api/pin-board?personaId=${clickedPersonaId}`, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            setPinboards(response.data);
        }
    }

    useEffect(() => {
        PersonaSetting();
    }, [activePersonaId])

    useEffect(() => {
        pinboardImport();
        console.log('clickedPersonaId: ', clickedPersonaId)
    }, [pinBoardName, clickedPersonaId])

    useEffect(() => {
        if(pageNum === 2 && pinBoardId === 0) {
            const persona_img = document.querySelectorAll('.persona-img');
            if(pinAddModalOpen && persona_img[0]!==undefined) {
                setClickedPersonaId(personas[0].id);
                persona_img[0].style.border="1px solid #FE3400";
            }
        } else if(pageNum === 1) {
            if(document.querySelector('.next-btn') && !urlTrue) {
                document.querySelector('.next-btn').classList.add('noPlayBtn');
            } else if(urlTrue) {
                document.querySelector('.next-btn').classList.remove('noPlayBtn');
            }
        } else if(pageNum === 3) {
            if(document.querySelector('.next-btn') && tagList.length === 0) {
                document.querySelector('.next-btn').classList.add('noPlayBtn');
            } else if(tagList.length !== 0) {
                document.querySelector('.next-btn').classList.remove('noPlayBtn');
            }
        }
    }, [pinAddModalOpen, pageNum, urlTrue, tagList])

    useEffect(() => {
        if(pageNum === 2) {
            if(document.querySelector('.next-btn') && pinBoardId === 0) {
                document.querySelector('.next-btn').classList.add('noPlayBtn');
                const pinBoard = document.querySelectorAll('.pinboard');
                for(var i=0;i<pinBoard.length;i++) {
                    pinBoard[i].style.color="#352C23";
                }
            } else if (pinBoardId !== 0) {
                document.querySelector('.next-btn').classList.remove('noPlayBtn');
            }
        }
    }, [pageNum, pinBoardId]);

    useEffect(() => {
        pinboardImport();
    }, [clickedPersonaId, pinBoardId]);

    const NextHandler = async (e) => {
        e.stopPropagation();
        if(pageNum < 4) {
            setPageNum(pageNum+1);
            if(pageNum === 3) {
                if(e.target.classList.contains('next-btn') && tagList.length === 0) {
                    setPageNum(3);
                } else if(e.target.classList.contains('next-btn') && tagList.length !== 0) {
                    try {
                        const token = cookies.get('token');
                        const response = await axios.post(process.env.REACT_APP_SERVER_HOST + '/api/pin', {
                            "pinBoardId": pinBoardId,
                            "tagList": tagList,
                            "url": urlValue
                        }, {
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        });
                        setNewPinId(response.data);
                        setPinAddTrue(response.status);
                    } catch(err) {
                        setPinAddTrue(400);
                    }
                } else if(e.target.className === 'skip-btn') {
                    try {
                        const token = cookies.get('token');
                        const response = await axios.post(process.env.REACT_APP_SERVER_HOST + '/api/pin', {
                            "pinBoardId": pinBoardId,
                            "tagList": [],
                            "url": urlValue
                        }, {
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        });
                        setNewPinId(response.data);
                        setPinAddTrue(response.status);
                    } catch(err) {
                        setPinAddTrue(400);
                    }
                }  
            } else if(pageNum === 1) {
                if(!urlTrue) {
                    setPageNum(1);
                }
            } else if(pageNum === 2) {
                if(pinBoardId === 0) {
                    setPageNum(2);
                }
            }
        } else {
            if(ChangeImgFormdata !== null) {
                const response = await axios.post(process.env.REACT_APP_SERVER_HOST + `/api/pin/image/${newPinId}`, ChangeImgFormdata);
            }
            setUrlValue("");
            setPageNum(1);
            await closeAddModal();
            window.location.reload();
        }
    }

    const PrevHandler = () => {
        if(pageNum > 1) {
            setPageNum(pageNum-1);
        } else {
            setPageNum(1);
        }
    }

    useEffect( async () => {
        if(pageNum === 2 && pinBoardId !== 0) {
            await pinboardImport();
            const personaList = document.querySelectorAll('.persona-img');
            for(var i=0;i<personaList.length;i++) {
                if(parseInt(personaList[i].getAttribute('value')) === clickedPersonaId) {
                    personaList[i].style.border="1px solid #FE3400";
                } else {
                    personaList[i].style.border="0";
                }
            }
            const pinboardList = document.querySelectorAll('.pinboard');
            for(var j=0;j<pinboardList.length;j++) {
                if(pinboardList[j].getAttribute('id') === pinBoardId) {
                    pinboardList[j].style.color="#FE3400";
                } else {
                    pinboardList[j].style.color="#352C23";
                }
            }            
        }
    }, [pageNum, clickedPersonaId, pinBoardId])

    const urlInputChange = (e) => {
        if(e.target.value === "") {
            setUrlTrue(false);
        } else {
            if(!e.target.value.includes("https://")) {
                setUrlTrue(false);
            } else {
                setUrlTrue(true);
            }
        }
        setUrlValue(e.target.value);
    }

    const personaImgClickHandler = (e) => {
        setPinBoardId(0);
        setClickedPersonaId(parseInt(e.target.getAttribute("value")));
        const personaList = document.querySelectorAll('.persona-img');
        for(var i=0;i<personaList.length;i++) {
            personaList[i].style.border="0";
        }
        e.target.style.border="1px solid #FE3400";
    }

    const pinBoardClickHandler = ({ target }) => {
        setPinBoardId(target.getAttribute("id"));
        const pinBoard = document.querySelectorAll('.pinboard');
        for(var i=0;i<pinBoard.length;i++) {
            pinBoard[i].style.color="#352C23";
        }
        target.style.color="#FE3400";
    }

    const pinboardChangeHandler = (e) => {
        setPinBoardInputValue(e.target.value);
    }

    const pinboardCreateClickHandler = async () => {
        const token = cookies.get('token');
        const response = await axios.post(
            process.env.REACT_APP_SERVER_HOST + '/api/pin-board',
            {
                "name": pinBoardInputValue,
                "personaId": clickedPersonaId
              }
            ,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                }
            );
        setPinBoardName(pinBoardInputValue);
        setPinBoardInputValue("");
    }

    const pinboardCreateSubmitHandler = async (e) => {
        if(e.key === 'Enter') {
            const token = cookies.get('token');
            const response = await axios.post(
                process.env.REACT_APP_SERVER_HOST + '/api/pin-board',
                {
                    "name": pinBoardInputValue,
                    "personaId": clickedPersonaId
                }
                ,
                    {
                        headers: {
                            Authorization: "Bearer " + token,
                        }
                    }
                );
            setPinBoardName(pinBoardInputValue);
            setPinBoardInputValue("");
        }
    }

    useEffect(() => {
        if(document.querySelector('.Pinboard-container')) {
            document.querySelector('.Pinboard-container').scrollTop = document.querySelector('.Pinboard-container').scrollHeight;
        }
    }, [pinBoardName]);

    // const ModalAddCloseHandler = async () => {
    //     const token = cookies.get('token');
    //     const response = await axios.post(process.env.REACT_APP_SERVER_HOST + '/api/pin', {
    //             "pinBoardId": pinBoardId,
    //             "tagList": tagList,
    //             "url": urlValue
    //     }, {
    //         headers: {
    //             Authorization: "Bearer " + token
    //         }
    //     });
    //     await closeAddModal();
    //     window.location.reload();
    // }

    const tagChangeHandler =(e) => {
        setTagValue(e.target.value);
        if(tagList.length < 5) {
            document.querySelector('.tag-length').style.display="none";
        }
    }

    const tagInputSubmitHandler = () => {
        if(window.event.keyCode == 13) {
            if(tagList.length < 5) {
                setTagList( prev => [...prev, tagValue]);
                setTagValue("");
                document.querySelector('.tag-length').style.display="none";
            } else {
                document.querySelector('.tag-length').style.display="inline";
            }
        }
    }

    const tagClickHandler = (e) => {
        setTagList(tagList.filter( tag => tag !== e.target.innerHTML));
    }

    useEffect(() => {
        if(tagList.length < 5 && document.querySelector('.tag-length')) {
            document.querySelector('.tag-length').style.display="none";
        }
    }, [tagList]);

    async function readImage (e) {
        var formData = new FormData();
        formData.append('pinImg', e.target.files[0]);
        setChangeImgFormdata(formData);
        const reader = new FileReader();
        setPrevImgUrl(URL.createObjectURL(e.target.files[0]));
        reader.readAsDataURL(e.target.files[0]);
    }

    useEffect( async () => {
        const token = cookies.get('token');
        const response = await axios.get(process.env.REACT_APP_SERVER_HOST + `/api/pin/${newPinId}`,
        {
            headers: {
                Authorization: "Bearer " + token,
            }
        }
        );
        setPrevImgUrl(response.data.pinImgPath);
    }, [newPinId]);

    useEffect(() => {
        const previewImage = document.getElementsByClassName("upload-file");
        previewImage.src = prevImgUrl.substring(5);
    }, [prevImgUrl])
    
    if(pinAddModalOpen) {
        if(pageNum === 1) {
            return (
                <div className="ModalAdd-Container" ref={modalAdd}>
                    <div className="Header-container">
                        <p className="header-title" id="header-title">
                            인사이트 핀 추가
                        </p>
                    </div>
                    <div className="Url-container">
                        <input className="url-input" value={urlValue} onChange={urlInputChange} placeholder="URL 을 입력해 주세요"/>
                    </div>
                    <div className="Next-container">
                        <button className="next-btn" onClick={NextHandler}>다음</button>
                    </div>
                </div>
            );
        } else if(pageNum === 2) {
            return (
                <div className="ModalAdd-Container" ref={modalAdd}>
                    <div className="Header-container2" style={{marginTop: '32px', marginLeft: '35px', marginBottom: '-40px'}}>
                        <img className="prev-img" src={prev} onClick={PrevHandler} style={{border:'none'}}/>
                    </div>
                    <div className="PersonaImg-container">
                        {personas.map(i => (
                            <img className="persona-img" value={i.id} src={i.profileImgPath} width="200" height="200" onClick={personaImgClickHandler}></img>
                        ))}
                    </div>
                    <div className="Pinboard-container">
                        {pinboards.map( pin => (
                            <div className="pinboard" id={pin.id} onClick={pinBoardClickHandler}>{pin.name}</div>
                        ))}
                    </div>
                    <div className="PinboardInput-container">
                        <input className="pinboard-input" value={pinBoardInputValue} onChange={pinboardChangeHandler} onKeyPress={pinboardCreateSubmitHandler} placeholder="새 핀보드명을 입력해주세요." />
                        <button className="pinboard-btn" onClick={pinboardCreateClickHandler}>추가</button>
                    </div>
                    <div className="Next-container">
                        <button className="next-btn" onClick={NextHandler}>다음</button>
                    </div>
                </div>
            );
        } else if(pageNum === 3) {
            return (
                <div className="ModalAdd-Container" ref={modalAdd}>
                    <div className="Header-container">
                        <img className="prev-img" src={prev} onClick={PrevHandler}/>
                        <p className="header-title">
                            추가 태그
                        </p>
                        <p className="header-description">
                            나만의 태그를 추가할 수 있어요!
                        </p>
                    </div>
                    <div className="Tag-container">
                        <input className="tag-input" value={tagValue} onChange={tagChangeHandler} onKeyPress={tagInputSubmitHandler} maxlength='8' placeholder="태그를 입력해주세요(최대5개)" />
                        <span className="tag-length" style={{display: 'none'}}>최대 5개까지 추가할 수 있습니다</span>
                    </div>
                    <div className="TagAfter-container">
                        {tagList?tagList.map( tag => (<div className="tag" onClick={tagClickHandler}>{tag}</div>)):<></>}
                    </div>
                    <div className="Next-container">
                        <button className="skip-btn" onClick={NextHandler}>건너뛰기</button>
                        <button className="next-btn" onClick={NextHandler}>다음</button>
                    </div>
                </div>
            );
        } else if(pageNum === 4 && pinAddTrue === 201) {
            return (
                <div className="ModalAdd-Container" ref={modalAdd}>
                    <div className="Header-container">
                        <img className="prev-img" src={prev} onClick={PrevHandler}/>
                        <p className="header-title">
                            인사이트 핀 추가 완료 !
                        </p>
                        <p className="header-description" id="header-description">
                            당신의 인사이트가 누군가에겐 큰 영감이 될 거에요:)
                        </p>
                    </div>
                    <div className="filebox">
                        <img className="upload-file" value="Thumbnail" src={prevImgUrl}/>
                        <label for="file">썸네일 이미지 변경</label> 
                        <input type="file" id="file" onChange={readImage}/>
                    </div>
                    <div className="Next-container">
                        <button className="next-btn" onClick={NextHandler}>완료</button>
                    </div>
                </div>
            );
        } else if(pinAddTrue === 400) {
            return(
            <div className="ModalAdd-Container" ref={modalAdd}>
                <div className="Header-container">
                    <img className="prev-img" src={prev} onClick={PrevHandler}/>
                </div>
                <img className="fail-logo" src={fail_logo}/>
                <p className="header-title2">
                    핀 추가 실패
                </p>
            </div>
            );
        } else {
            return(<></>);
        }
    } else {
        return(<></>);
    }
}

export default PinAdd;


// return (
    // (pinAddModalOpen?
    // <div className="ModalAdd-Container" ref={modalAdd}>
    //     <div className="Url-container">
    //         <input className="url-input" value={urlValue} onChange={urlInputChange} placeholder="URL을 입력해주세요."/>
    //     </div>
    //     <div className="PinBoard-container">
    //         {pinboard.map( board => (
    //             <p className="board-name" id={board.id} onClick={pinBoardClickHandler}>{board.name}</p>
    //         ))}
    //     </div>
    //     <div className="Tag-container">
    //         <div className="tag-after"></div>
    //         {tagList.length!==2?<input className="tag-before" value={tagValue} onChange={tagChangeHandler} onKeyPress={tagInputSubmitHandler} maxlength='8'/>:null}
    //     </div>
    //         {/* {tagList.length===2?<p>최대 2개까지 추가할 수 있습니다</p>:null} */}
    //     <div className="Close-container">
    //         <button className="close-btn" onClick={ModalAddCloseHandler}>저장</button>
    //     </div>
    // </div>
    // :null)
    // );