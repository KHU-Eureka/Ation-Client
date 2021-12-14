import { React, useState, useEffect } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

import "../../assets/css/mypage/PinEdit.css";
import close_icn from "../../assets/svg/close.svg";
import plus from "../../assets/svg/plus.svg";

function PinEdit(props) {
    const cookies = new Cookies;
    const { pinEditModalOpen, clickedPin, close, editPosition, setEditTrue, setEditClickTrue } = props;

    const [personas, setPersonas] = useState([]);
    const [pinboards, setPinboards] = useState([]);
    const [clickedPersonaId, setClickedPersonaId] = useState(0);
    const [afterPinboardId, setAfterPinboardId] = useState(0);
    const [afterTag, setAfterTag] = useState([]);

    const EditPosition = () => {
        document.querySelector(".PinEdit-Container").style.top=`${editPosition[1]}px`;
        document.querySelector(".PinEdit-Container").style.left=`${editPosition[0]}px`;
    }

    const PersonaSetting = async () => {
        const token = cookies.get('token');
        const response = await axios.get(
            'http://163.180.117.22:7218/api/persona',
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
          );
        const response2 = await axios.get(
            'http://163.180.117.22:7218/api/persona/user', 
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
        const token = cookies.get('token');
        const response = await axios.get(`http://163.180.117.22:7218/api/pin-board?personaId=${clickedPersonaId}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        setPinboards(response.data);
    }

    useEffect(() => {
        if(pinEditModalOpen) {
            EditPosition();
            setEditTrue(true);
        }
        PersonaSetting();
    }, [editPosition])

    useEffect(() => {
        pinboardImport();
    }, [clickedPersonaId]);

    const personaClickHandler = async (e) => {
        setClickedPersonaId(e.target.getAttribute("id"));
    }

    const pinboardClickHandler = (e) => {
        setAfterPinboardId(e.target.getAttribute("id"));
    }

    const closeBtnClickHandler = async () => {
        const token = cookies.get('token');
        const response = await axios.put(`http://163.180.117.22:7218/api/pin/${clickedPin.id}`,
        {
            "pinBoardId": afterPinboardId,
            "tagList": afterTag
          }, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        alert("핀이 수정되었습니다");
        close();
    }

    return (
        <>
        {pinEditModalOpen? (
            
    <div className="PinEdit-Container" >
        <div className="PersonaImg-Container">
            {personas.map( persona => (
                <img className="persona-img" id={persona.id} src={persona.profileImgPath} onClick={personaClickHandler}/>
            ))}
        </div>
        <div className="PinBoard-Container">
            {pinboards.map( pinboard => (
                <p className="pinboard-name" id={pinboard.id} onClick={pinboardClickHandler}>{pinboard.name}</p>
            ))}
        </div>
        <div className="Tag-Container">
            {clickedPin.tagList.map( tag => (
                <div className="tag-cover">
                    <span className="pin-tag">#{tag}&nbsp;</span>
                    <img className="tag-close" src={close_icn}/>
                </div>
            ))}
            {/* {clickedPin.tagList.length < 3?<div><img src={plus}/></div>:<></>} */}
        </div>
        <div className="CloseBtn-Container">
            <button className="close-btn" onClick={closeBtnClickHandler}>저장</button>
        </div>
    </div>
    ):null}
    </>);
}

export default PinEdit;