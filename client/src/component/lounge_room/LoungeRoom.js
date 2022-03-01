import { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { Cookies } from "react-cookie";
import axios from 'axios';
import LoungeBoard from "../lounge_board/LoungeBoard";
import LoungeWaitSideBar from "../lounge_wait/LoungeWaitSideBar";
import LoungeWaitChatting from "../lounge_wait/LoungeWaitChatting";
import LoungeActiveSideBar from "../lounge_active/LoungeActiveSideBar";

import "../../assets/css/lounge/LoungeRoom.css";

function LoungeRoom () {
    const { id } = useParams(); // room id
    const cookies = new Cookies();

    let [roomInfo, setRoomInfo] = useState({});

    useLayoutEffect(()=> {
        const getRoomInfo = async () => {
            const token = cookies.get('token');
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
            <div className="left-content">
                {
                    /* room의 상태가 open인 상태라면.. */
                    roomInfo.status === "OPEN"
                    ? <LoungeWaitSideBar roomInfo={roomInfo} setRoomInfo={setRoomInfo}/>
                    : <LoungeActiveSideBar />
                }
            </div>
            <div className="right-content">
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