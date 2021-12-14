import { React, useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

import "../../assets/css/mypage/PinBoardAdd.css";
import logo from "../../assets/svg/logo.svg";


function PinBoardAdd(props) {
    const cookies = new Cookies;
    const modalPinBoardAdd = useRef();
    const {pinBoardAddModalOpen, closePinBoardAddModal, activePersonaId} = props;

    const [pinBoardName, setPinBoardName] = useState("");

    const PinBoardAddModalCloseHandler = ({ target }) => {
        if (pinBoardAddModalOpen && !modalPinBoardAdd.current.contains(target)) {
            closePinBoardAddModal();
        }
      };

    useEffect(() => {
        window.addEventListener("click", PinBoardAddModalCloseHandler);
        return () => {
          window.removeEventListener("click", PinBoardAddModalCloseHandler);
        };
    }, [pinBoardAddModalOpen])

    const nameInputChange = (e) => {
        setPinBoardName(e.target.value);
    }

    const closeBtnClickHandler = async () => {
        const token = cookies.get('token');
        const response = await axios.post('http://163.180.117.22:7218/api/pin-board', {
                "name": pinBoardName,
                "personaId": activePersonaId
        }, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        window.location.reload();
    }

    return (
    (pinBoardAddModalOpen?
    <div className="ModalPinBoardAdd-Container" ref={modalPinBoardAdd}>
        <div className="Logo-container">
            <img className="logo" src={logo}/>
        </div>
        <div className="NameInput-container">
            <input className="name-input" value={pinBoardName} onChange={nameInputChange} placeholder="새 핀보드명을 입력해주세요."/>
            <button className="close-btn" onClick={closeBtnClickHandler}>생성</button>
        </div>
    </div>
    :null)
    );
}

export default PinBoardAdd;