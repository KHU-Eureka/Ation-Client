import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import SockJsClient from 'react-stomp';
import axios from 'axios';

import LoungeWaitSideBar from "../lounge_wait/LoungeWaitSideBar";
import LoungeWaitChatting from "../lounge_wait/LoungeWaitChatting";
import LoungeActiveSideBar from "../lounge_active/LoungeActiveSideBar";
import RoomInfoModal from "../modal/RoomInfoModal";

import "../../assets/css/lounge/LoungeRoom.css";
import RoomEditModal from "../modal/RoomEditModal";
import Whiteboard from "../whiteboard/Whiteboard";

function LoungeRoom () {
    const $websocket = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const activePersonaId = useSelector(state=>state.activePersonaId);
    const { id } = useParams(); // room id

    let [roomInfo, setRoomInfo] = useState(null); // 방 정보
    let [memberList, setMemberList] = useState(null);
    let [ admin, setAdmin ] = useState(null); // 방장
    let [ myInfo, setMyInfo ] = useState(null); // 내 정보
    let [showLoungeStartModal, setShowLoungeStartModal] = useState(false);
    let [showRoomInfoModal, setShowRoomInfoModal] = useState(false);
    let [showRoomEditModal, setShowRoomEditModal] = useState(false);

    const startRoom = async () => {
        let temp = {...roomInfo};
        temp.status = 'START';
        setRoomInfo(temp);
    }

    const receiveRoomStatusMsg = (msg) => {
        if (msg.persona && msg.status) { // 만약 member 정보에 관한 거라면
            //let temp = {...roomInfo};
            let tempMemberList = [...memberList];
            switch(msg.status) {
              case 'ENTER':
                let addMember = { admin: false, ready: false, persona: msg.persona };
                //temp.memberList = [...temp.memberList, addMember];
                tempMemberList = [...memberList, addMember];
                break;
              case 'EXIT':
                //temp.memberList = temp.memberList.filter(elem=>elem.persona.id !== msg.persona.id);
                tempMemberList = tempMemberList.filter(elem=>elem.persona.id !== msg.persona.id);
                break;
              case 'READY':
                //temp.memberList.find(elem=>elem.persona.id===msg.persona.id).ready = true;
                tempMemberList.find(elem=>elem.persona.id===msg.persona.id).ready = true;
                break;
              case 'UNREADY':
                //temp.memberList.find(elem=>elem.persona.id===msg.persona.id).ready = false;
                tempMemberList.find(elem=>elem.persona.id===msg.persona.id).ready = false;
                break;
              default:
            }
            setMemberList(tempMemberList);
            //setRoomInfo(temp);
        } else if (msg.status) { // 만약 방 정보에 관한 거라면
            switch(msg.status) {
            case 'START':
                startRoom(); // 방 상태를 전환시킴
                break;
            case 'END':
                // lounge 페이지로 이동시킴
                navigate('/lounge', { state: {alert:{title: "라운지 방이 종료되었습니다", subtitle: "즐거운 시간이었나요?", show: true}}})
                break;
            default:
            }
        }
    }

    const getMyInfo = () => {
        const findMyInfo = memberList.find((elem)=>elem.persona.id===activePersonaId);
        if (findMyInfo) { // 멤버 목록 중에 내가 있다면 -> 내 정보를 저장
            setMyInfo(findMyInfo);
        }    
    }

    useEffect(()=> {
        // 방장과 내 정보를 따로 저장
        if (memberList && activePersonaId) {
            getMyInfo();
        }
    }, [activePersonaId, memberList])

    const changeActivePersona = async (id) => {
        const token = localStorage.getItem('token')
        try {
            await axios.put(
                process.env.REACT_APP_SERVER_HOST+'/api/persona/user/' + id, {},
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            )
            dispatch({type: 'CHANGEPERSONA', data: id})
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(()=> {
        const getRoomInfo = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_SERVER_HOST}/api/lounge/${id}`, {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    }
                )
                console.log('room info : ', res.data);
                setRoomInfo(res.data);
                setMemberList(res.data.memberList);
                setAdmin(res.data.memberList.find((elem)=>elem.admin).persona);
                isItMyRoom(res.data);
            } catch(err) {
                navigate('/lounge', { state: {alert:{title: "존재하지 않는 방입니다.", subtitle: "다른 방을 이용해주세요 :)"}}})
                console.log(err);
            }
        }

        const isItMyRoom = async (roomInfo) => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_SERVER_HOST}/api/persona`, {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    }
                )

                let personaIdList = [];
                for (let persona of res.data) {
                    personaIdList.push(persona.id);
                }

                let goOutside = true;
                for (let member of roomInfo.memberList) {
                    if (personaIdList.includes(member.persona.id)) {
                        goOutside = false;
                        changeActivePersona(member.persona.id);
                        break;
                    }
                }

                if (goOutside) {
                    navigate('/lounge', { state: {alert:{title: "해당 방에 접근 권한이 없습니다.", subtitle: "다른 방을 이용해주세요 :)"}}});
                }
            } catch(err) {
                console.log(err);
            }
        }

        getRoomInfo();
    }, [])

    return (
        <div className="lounge-room">
            { showRoomInfoModal && <RoomInfoModal roomInfo={roomInfo} setShowRoomInfoModal={setShowRoomInfoModal} isAdmin={admin.id===activePersonaId} admin={admin} setShowModal={setShowRoomInfoModal} setShowRoomEditModal={setShowRoomEditModal}/> }
            { showRoomEditModal && <RoomEditModal roomInfo={roomInfo} setRoomInfo={setRoomInfo} setShowModal={setShowRoomEditModal}/> }
            {/* rounge room status 관련 socket */}
            { roomInfo &&
                <SockJsClient
                url="http://ation-server.seohyuni.com/ws"
                topics={[`/lounge/${roomInfo.id}/status/send`, `/lounge/${roomInfo.id}/member/send`]}
                onMessage={msg => { receiveRoomStatusMsg(msg) }} 
                ref={$websocket}
                />
            }
            <div className="left-content lounge-sidebar">
                {
                    /* room의 상태가 open인 상태라면.. */
                    roomInfo && ( roomInfo.status === "OPEN"
                    ? <LoungeWaitSideBar roomInfo={roomInfo} memberList={memberList} admin={admin} myInfo={myInfo} setShowLoungeStartModal={setShowLoungeStartModal} setShowRoomInfoModal={setShowRoomInfoModal}/>
                    : <LoungeActiveSideBar roomInfo={roomInfo} memberList={memberList} admin={admin} myInfo={myInfo} setShowRoomInfoModal={setShowRoomInfoModal}/>)
                }
            </div>
            <div className="right-content">
                {
                    roomInfo && ( roomInfo.status === "OPEN"
                    ? <LoungeWaitChatting roomInfo={roomInfo} setRoomInfo={setRoomInfo}/>
                    : <Whiteboard /> )
                }
            </div>
            
        </div>
    )
}

export default LoungeRoom;