import { React, useState, useEffect } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

function PinUP(props) {
    const cookies = new Cookies();
    const {pageNum, setPageNum, close, header, personaImg, personaId, insightId} = props;
    const [pinboard, setPinboard] = useState([]);
    const [persona, setPersona] = useState(personaId);
    const [pinInputValue, setPinInputValue] = useState("");

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
        console.log(e.target.getAttribute("value"));
    }

    useEffect(() => {
        pinboardImport();
    }, [persona])

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
    }

    const pinboadClickHandler = async (e) => {
        const token = cookies.get('token');
        const response = await axios.post(
            'http://163.180.117.22:7218/api/pin/up',
            {
                "insightId": insightId,
                "pinBoardId": e.target.getAttribute('id')
              }
            ,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                }
            );
    }
      
            if(pageNum === 1) {
                return (
                    <div className="Pinup-container">
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
                            <button className="pinboard-btn" onClick={pinboardCreateClickHandler}></button>
                        </div>
                    </div>
                );
            } else if(pageNum === 2) {
                return (
                    <div className="Pinup-container">
                        <div>인사이트 추가</div>
                        <input placeholder="url을 입력해주세요" />
                        <button>다음</button>
                    </div>
                );
            }
                
           
     

}

export default PinUP;