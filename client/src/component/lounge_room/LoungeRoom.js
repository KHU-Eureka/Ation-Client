import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Cookies } from "react-cookie";
import SockJsClient from 'react-stomp';
import axios from 'axios';

import LoungeBoard from "../lounge_board/LoungeBoard";
import LoungeWaitSideBar from "../lounge_wait/LoungeWaitSideBar";
import LoungeWaitChatting from "../lounge_wait/LoungeWaitChatting";
import LoungeActiveSideBar from "../lounge_active/LoungeActiveSideBar";
import LoungeStartModal from "../modal/LoungeStartModal";

import "../../assets/css/lounge/LoungeRoom.css";

function LoungeRoom () {
    const $websocket = useRef(null);
    const navigate = useNavigate();
    const activePersonaId = useSelector(state=>state.activePersonaId);
    const { id } = useParams(); // room id
    const cookies = new Cookies();

    let [roomInfo, setRoomInfo] = useState({});
    let [showLoungeStartModal, setShowLoungeStartModal] = useState(false);

    const startRoom = async () => {
        let temp = {...roomInfo};
        temp.status = 'START';
        setRoomInfo(temp);
    }

    const exitRoom = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(
                `${process.env.REACT_APP_SERVER_HOST}/api/lounge/${roomInfo.id}/ready/${activePersonaId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
            )
        } catch(err) {
            console.log(err)
        }
    }

    const receiveRoomStatusMsg = (msg) => {
        if (msg.status) {
            switch(msg.status) {
            case 'START':
                setShowLoungeStartModal(true) // start modal을 띄움
                break;
            case 'END':
                // lounge 페이지로 이동시킴
                navigate('/lounge', { state: {alert:{title: "라운지 방이 종료되었습니다", subtitle: "즐거운 시간이었나요?", show: true}}})
                break;
            default:
            }
        }
    }

    useLayoutEffect(()=> {
        const getRoomInfo = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_SERVER_HOST}/api/lounge/${id}`, {
                        headers: {
                            Authorization: {
                                Bearer: 'Bearer ' + token
                            }
                        }
                    }
                )
                setRoomInfo(res.data);
                console.log(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        getRoomInfo();
    }, [])

    return (
        <div className="lounge-room">
            {/* rounge room status 관련 socket */}
            <SockJsClient
              url="http://ation-server.seohyuni.com/ws"
              topics={[`/lounge/${roomInfo.id}/status/send`]}
              onMessage={msg => { receiveRoomStatusMsg(msg) }} 
              ref={$websocket}
            />
            <div className="left-content">
                {
                    /* room의 상태가 open인 상태라면.. */
                    roomInfo.status === "OPEN"
                    ? <LoungeWaitSideBar roomInfo={roomInfo} setRoomInfo={setRoomInfo} setShowLoungeStartModal={setShowLoungeStartModal}/>
                    : <LoungeActiveSideBar />
                }
            </div>
            <div className="right-content">
            {   /* lounge room 시작 count down 모달창*/
                showLoungeStartModal && 
                <LoungeStartModal roomTitle={roomInfo.title} exitRoom={exitRoom} setShowModal={setShowLoungeStartModal} startRoom={startRoom}/> 
            }
                {
                    roomInfo.status === "OPEN"
                    ? <LoungeWaitChatting roomInfo={roomInfo} setRoomInfo={setRoomInfo}/>
                    : <LoungeBoard />
                }
            </div>

        </div>
    )
}

export default LoungeRoom;