import { React, useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

import "../../assets/css/mypage/PinBoardAdd.css";
import logo from "../../assets/svg/logo.svg";

function PinBoardEdit(props) {
    const cookies = new Cookies;
    const modalPinBoardEdit = useRef();
    const {pinBoardEditModalOpen, closePinBoardEditModal, BoardEditPosition, clickedPinBoardID} = props;

    const [pinBoardName, setPinBoardName] = useState("");
    const [personas, setPersonas] = useState([]);
    const [clickedPersonaId, setClickedPersonaId] = useState(0);

    let style = {
        top:BoardEditPosition[1],
        left:BoardEditPosition[0]
    }

    const PinBoardAddModalCloseHandler = ({ target }) => {
        if (pinBoardEditModalOpen && !modalPinBoardEdit.current.contains(target) && target.className !== 'Mypin-edit2') {
            closePinBoardEditModal();
        }
      };

    useEffect(() => {
        window.addEventListener("click", PinBoardAddModalCloseHandler);
        return () => {
          window.removeEventListener("click", PinBoardAddModalCloseHandler);
        };
    }, [pinBoardEditModalOpen]);

    const nameInputChange = (e) => {
        setPinBoardName(e.target.value);
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

    useEffect(() => {
        PersonaSetting();
    }, [BoardEditPosition])

    const personaClickHandler = async (e) => {
        setClickedPersonaId(e.target.getAttribute("id"));
    }

    const closeBtnClickHandler = async () => {
        const token = cookies.get('token');
        const response = await axios.put(`http://163.180.117.22:7218/api/pin-board/${clickedPinBoardID}`, {
                "name": pinBoardName,
                "personaId": clickedPersonaId
        }, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        closePinBoardEditModal();
        window.location.reload();
    }

    return (
    (pinBoardEditModalOpen?
    <div className="ModalPinBoardAdd-Container" ref={modalPinBoardEdit} style={style}>
        <div className="PersonaImg-Container">
            {personas.map( persona => (
                <img className="persona-img" id={persona.id} src={persona.profileImgPath} onClick={personaClickHandler} width={100} height={100}/>
            ))}
        </div>
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

export default PinBoardEdit;