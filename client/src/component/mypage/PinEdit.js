import { React, useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

import "../../assets/css/mypage/PinEdit.css";

function PinEdit(props) {
    const cookies = new Cookies;
    const modalEdit = useRef();
    const { pinEditModalOpen, clickedPin, closeEditModal, editPosition} = props;

    const [personas, setPersonas] = useState([]);
    const [pinboards, setPinboards] = useState([]);
    const [clickedPersonaId, setClickedPersonaId] = useState(0);
    const [afterPinboardId, setAfterPinboardId] = useState(0);
    const [afterTag, setAfterTag] = useState([]);
    const [tagValue, setTagValue] = useState("");
    const [pinboardInputValue, setPinBoardInputValue] = useState("");
    const [PinboardScroll, setPinboardScroll] = useState(0);

    let style = {
        top:editPosition[1],
        left:editPosition[0]
    }

    const PinEditModalCloseHandler = ({ target }) => {
        //console.log(target);
        if (pinEditModalOpen && !modalEdit.current.contains(target) && target.className !== 'Mypin-edit' && target.className !== 'tag') {
            setPinBoardInputValue("");
            closeEditModal();
        }
    };

    useEffect(() => {
        window.addEventListener('click', PinEditModalCloseHandler);
        return () => {
            window.removeEventListener("click", PinEditModalCloseHandler);
          };
    }, [pinEditModalOpen])

    const PersonaSetting = async () => {
        const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
        const response = await axios.get(process.env.REACT_APP_SERVER_HOST + `/api/pin-board?personaId=${clickedPersonaId}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        setPinboards(response.data);
    }

    useEffect(() => {
        PersonaSetting();
        if(clickedPin) {
            setAfterPinboardId(clickedPin.pinBoard.id);
            setAfterTag(clickedPin.tagList);
        }
    }, [editPosition])

    useEffect(() => {
        pinboardImport();
        if(document.querySelector('.PinBoard-Container')) {
            document.querySelector('.PinBoard-Container').scrollTop = document.querySelector('.PinBoard-Container').scrollTo(0,0);
        }
    }, [clickedPersonaId, afterPinboardId]);

    useEffect(() => {
        const persona_img = document.querySelectorAll('.persona-img');
        if(pinEditModalOpen && persona_img[0]!==undefined) {
            setClickedPersonaId(personas[0].id);
            persona_img[0].style.border="1px solid #FE3400";
        }
    }, [pinEditModalOpen]);

    const personaClickHandler = async (e) => {
        setClickedPersonaId(e.target.getAttribute("id"));
        const personaList = document.querySelectorAll('.persona-img');
        for(var i=0;i<personaList.length;i++) {
            personaList[i].style.border="0";
        }
        e.target.style.border="1px solid #FE3400";
    }

    const pinboardClickHandler = (e) => {
        setAfterPinboardId(e.target.getAttribute("id"));
        const pinBoardList = document.querySelectorAll('.pinboard-name');
        for(var i=0;i<pinBoardList.length;i++) {
            pinBoardList[i].style.color="#352C23";
        }
        e.target.style.color="#FE3400";
    }

    const closeBtnClickHandler = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.put(process.env.REACT_APP_SERVER_HOST + `/api/pin/${clickedPin.id}`,
        {
            "pinBoardId": afterPinboardId,
            "tagList": afterTag
          }, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        await closeEditModal();
        window.location.reload();
    }

    const tagChangeHandler = (e) => {
        setTagValue(e.target.value);
    }

    const tagInputSubmitHandler = () => {
        const tag_after = document.querySelector('.tag-after');
        const tags = document.createElement('div');
        tags.className = 'tag';
        tags.addEventListener('click', () => {
            setAfterTag(afterTag.filter( tag => tag !== tags.innerHTML));
          })
        if(window.event.keyCode === 13) {
            if(afterTag.length < 5) {
                console.log(afterTag.length);
                setAfterTag( prev => [...prev, tagValue]);
                setTagValue("");
            }
        }
    }

    const tagClickHandler = (e) => {
        setAfterTag(afterTag.filter( tag => tag !== e.target.innerHTML));
    }

    const pinboardInputChangeHandler = (e) => {
        setPinBoardInputValue(e.target.value);
    }

    const pinboardCreateClickHandler = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            process.env.REACT_APP_SERVER_HOST + '/api/pin-board',
            {
                "name": pinboardInputValue,
                "personaId": clickedPersonaId
              }
            ,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                }
            );
        setAfterPinboardId(response.data);
        setPinboardScroll(document.querySelector('.PinBoard-Container').scrollHeight);
        setPinBoardInputValue("");
    }

    const pinboardCreateSubmitHandler = async (e) => {
        if(e.key === 'Enter') {
            const token = localStorage.getItem('token');
        const response = await axios.post(
            process.env.REACT_APP_SERVER_HOST + '/api/pin-board',
            {
                "name": pinboardInputValue,
                "personaId": clickedPersonaId
              }
            ,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                }
            );
        setAfterPinboardId(response.data);
        setPinboardScroll(document.querySelector('.PinBoard-Container').scrollHeight);
        setPinBoardInputValue("");
        }
    }

    useEffect(() => {
        if(document.querySelector('.PinBoard-Container')) {
            document.querySelector('.PinBoard-Container').scrollTop = PinboardScroll;
            console.log(document.querySelector('.PinBoard-Container').scrollTop, document.querySelector('.PinBoard-Container').scrollHeight)
        }
    }, [PinboardScroll]);
    

    return (
    <>
    {pinEditModalOpen? (        
    <div className="PinEdit-Container" ref={modalEdit} style={style}>
        <div className="PersonaImg-Container">
            {personas.map( persona => (
                <img className="persona-img" id={persona.id} src={persona.profileImgPath} onClick={personaClickHandler}/>
            ))}
        </div>
        <div className="PinBoard-Container">
            {pinboards.map( pinboard => (
                <div className="pinboard-name" id={pinboard.id} onClick={pinboardClickHandler}>{pinboard.name}</div>
            ))}
        </div>
        <div className="PinBoardName-Container">
            <input className="pinboard-input" value={pinboardInputValue} onChange={pinboardInputChangeHandler} onKeyPress={pinboardCreateSubmitHandler} placeholder="새 핀보드명을 입력해주세요."/>
            <button className="pinboardInput-btn" onClick={pinboardCreateClickHandler}>추가</button>
        </div>
        <div className="Tag-Container">
            <div className="tag-after">
                {afterTag?afterTag.map( tag => (
                    <div className="tag" onClick={tagClickHandler}>{tag}</div>
                )):<></>}
                {afterTag.length<5?
                <input className="tag-before" value={tagValue} onChange={tagChangeHandler} onKeyPress={tagInputSubmitHandler} maxlength='8' placeholder="태그"/>:null}
            </div>
        </div>
        <div className="CloseBtn-Container">
            <button className="close-btn" onClick={closeBtnClickHandler}>완료</button>
        </div>
    </div>
    ):null}
    </>);
}

export default PinEdit;