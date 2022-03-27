import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SockJsClient from 'react-stomp';
import axios from "axios";

import LoungeStartModal from "../modal/LoungeStartModal";

function LoungeRoomHandler() {
    const $websocket = useRef(null);
    const dispatch = useDispatch();
    const waitingRoomList = useSelector(state=>state.waitingRoomList);
    let [socketTopics, setSocketTopics] = useState([]);
    let [showLoungeStartModal, setShowLoungeStartModal] = useState(false);
    let [currRoomId, setCurrRoomId] = useState(8);
    let [roomInfo, setRoomInfo] = useState({});
    let [personaId, setPersonaId] = useState(0);
    let [currWaitingInfo, setCurrWaitingInfo] = useState({title: ''});

    const exitRoom = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(
                `${process.env.REACT_APP_SERVER_HOST}/api/lounge/${currWaitingInfo.id}/exit/${currWaitingInfo.personaId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
            )
            setShowLoungeStartModal(false); // lounge 시작 모달창을 닫음
        } catch(err) {
            console.log(err)
        }
    }

    /*
    useEffect(()=> {
        const getRoomInfo = async () => { // 메세지가 온 방의 정보를 받아옴
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_SERVER_HOST}/api/lounge/${roomInfo.id}`, {
                        headers: {
                            Authorization: {
                                Bearer: 'Bearer ' + token
                            }
                        }
                    }
                )
                setRoomInfo(res.data);
                getPersonaId(res.data);
            } catch(err) {
                console.log(err);
            }
        }

        const getPersonaId = async (currRoom) => { // 그 방에 존재하는 나의 persona id를 알아냄
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_SERVER_HOST}/api/lounge/current`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                const myCurrRoomList = res.data;
                for (let room of myCurrRoomList) {
                    if (room.lounge.id === currRoom.id) {
                        setPersonaId(room.persona.id);
                        break;
                    }
                }
            } catch(err) {
                console.log(err);
            }
        }

        getRoomInfo();
    }, [currRoomId])
    */

    const receiveMessage = (msg) => {
        if (msg.status) {
            switch(msg.status) {
                case 'START':
                    setCurrRoomId(8); // setCurrRoomId(msg.id);
                    setShowLoungeStartModal(true) // start modal을 띄움
                    setCurrWaitingInfo(waitingRoomList.find(elem=>elem.id===currRoomId));
                    dispatch({type: 'DEL_WAITING', data: currRoomId}); // 대기 목록에서 삭제시킴 => 구독 취소
                    break;
                case 'END':
                    dispatch({type: 'DEL_WAITING', data: currRoomId});
                    break;
                default:
            }
        }
    }

    useEffect(()=> { // 구독시킴
        let tempList = [];
        console.log('waitingRoomList: ', waitingRoomList);
        for (let room of waitingRoomList) {
            tempList.push(`/lounge/${room.id}/status/send`);
        }
        setSocketTopics(tempList);
        console.log("waiting room socket : ", tempList);
    }, [waitingRoomList])

    useEffect(()=> { // 초기에 대기중인 room id list redux 저장하기
        const getWaitingRoom = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_SERVER_HOST}/api/lounge/wait`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                let roomList = [];
                for (let room of res.data) {
                    roomList.push({ id: room.lounge.id, personaId: room.persona.id, title: room.lounge.title });
                }
                dispatch({type: 'WAITING_ROOM', data: roomList});
                dispatch()
            } catch(err) {
                console.log(err);
            }
        }

        getWaitingRoom();
    }, [])

    return (
        <>
        {   /* lounge room 시작 count down 모달창*/
            showLoungeStartModal && 
            <LoungeStartModal roomTitle={currWaitingInfo.title} roomId={currWaitingInfo.id} exitRoom={exitRoom} setShowModal={setShowLoungeStartModal} /> 
        }
        <SockJsClient
            url="http://ation-server.seohyuni.com/ws"
            topics={socketTopics}
            onMessage={msg => { receiveMessage(msg) }} 
            ref={$websocket}
        />
        </>
    )
}

export default LoungeRoomHandler;