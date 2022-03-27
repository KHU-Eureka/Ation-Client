import { React, useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

import "../../assets/css/mypage/PinBoardAdd.css";
import logo2 from "../../assets/svg/logo2.svg";


function PinBoardAdd(props) {
    const cookies = new Cookies;
    const modalPinBoardAdd = useRef();
    const {pinBoardAddModalOpen, closePinBoardAddModal, activePersonaId, setAddTrue} = props;

    const [pinBoardName, setPinBoardName] = useState("");

    const PinBoardAddModalCloseHandler = ({ target }) => {
        if (pinBoardAddModalOpen && !modalPinBoardAdd.current.contains(target)) {
            closePinBoardAddModal();
            setPinBoardName("");
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
        const token = localStorage.getItem('token');
        const response = await axios.post(process.env.REACT_APP_SERVER_HOST + '/api/pin-board', {
                "name": pinBoardName,
                "personaId": activePersonaId
        }, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        await setAddTrue(true);
        await setPinBoardName("");
        closePinBoardAddModal();
        // window.location.reload();
    }

    useEffect(() => {
        if(pinBoardAddModalOpen) {
            if(document.querySelector('.close-btn') && pinBoardName === "") {
                document.querySelector('.close-btn').classList.add('noPlayBtn');
            } else if(pinBoardName !== "") {
                document.querySelector('.close-btn').classList.remove('noPlayBtn');
            }
        }
    }, [pinBoardAddModalOpen, pinBoardName])

    return (
    (pinBoardAddModalOpen?
    <div className="ModalPinBoardAdd-Container" ref={modalPinBoardAdd}>
        <div className="Logo-container">
            <img className="logo" src={logo2}/>
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