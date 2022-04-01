import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useInView } from 'react-intersection-observer';
import SockJsClient from 'react-stomp';
import { Cookies } from "react-cookie";
import axios from "axios";

import { FiArrowDown } from "react-icons/fi";
import tack_empty from "../../assets/image/tack_empty.png";
import tack_fill from "../../assets/image/tack_fill.png";
import "../../assets/css/lounge/LoungeWaitChatting.css";

function LoungeWaitChatting(props) {
    const $websocket = useRef(null); // socket
    const activePersonaId = useSelector(state=>state.activePersonaId);
    const [chattingBottom, isChattingBottom] = useInView();
    const { roomInfo, setRoomInfo } = props;

    const sampleList = [
        '안녕하세요 :)', '열띤 토론 한번 해봅시다!', '엠비티아이 소개해주세요 !',
        '각자 맡은 역할 말해주세요 !', '매너 있는 대화 해요 :)', '주제에 대해 더 설명해주세요'
    ]

    let [chattingList, setChattingList] = useState([]);
    let [minReady, setMinReady] = useState(0);
    let [text, setText] = useState(''); // user가 채팅에 입력하는 text
    let [isNotice, setIsNotice] = useState(false); // user가 채팅에 입력하는 text가 공지인지
    let [newMsgCount, setNewMsgCount] = useState(0);
    let [showNewMsg, setShowNewMsg] = useState(false);

    useEffect(()=> { // 최소 ready 멤버 명 수 구하기
        setMinReady(Math.ceil(roomInfo.limitMember/3)) // limit member의 1/3 이상
    }, [roomInfo.limitMember])

    useLayoutEffect(()=> { // lounge 채팅 불러오기
        const getLoungeChat = async () => {
            const token = localStorage.getItem('token')
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_SERVER_HOST}/api/lounge/${roomInfo.id}/chat`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                setChattingList(res.data);
                document.getElementById("chatting-bottom").scrollIntoView();
            } catch(err) {
                console.log(err)
            }
        }
        getLoungeChat();
    }, [])

    const getTime = (dateString) => {
        const date = new Date(dateString);
        let timeFormat;
        let ampm = (date.getHours() < 12 ? '오전' : '오후');
        let hours = (date.getHours() < 12 ? date.getHours() : date.getHours()-12).toString();
        let minutes = date.getMinutes().toString();
        
        hours = (hours.length===2 ? hours : '0'+hours);
        minutes = (minutes.length===2 ? minutes : '0'+minutes);

        timeFormat = `${ampm} ${hours}:${minutes}`;

        return timeFormat;
    }

    const dateChanged = (curr, last) => {
        const currDate = new Date(curr);
        const lastDate = new Date(last);
        
        if (currDate.getDate() !== lastDate.getDate() || currDate.getMonth() !== lastDate.getMonth() || currDate.getFullYear() !== lastDate.getFullYear())
            return true;
        return false;
    }

    const getDate = (dateString) => {
        const currDate = new Date(dateString);
        let dateFormat;
        const year = currDate.getFullYear();
        const month = currDate.getMonth() + 1;
        const date = currDate.getDate();
        dateFormat = `${year}년 ${month}월 ${date}일`;

        return dateFormat
    }

    const sendChatting = (e) => { // form 보내기
        e.preventDefault();
        if (text.length) { // text가 존재한다면
            if (isNotice) { // 공지라면
                sendNotice();
            } else // 일반 메시지라면
                sendMessage(text);
            
            setText(''); // 보낸 후 사용자 입력창 초기화
        }
    }

    const sendMessage = () => { // 메세지 보내기
        try {
            $websocket.current.sendMessage(`/lounge/${roomInfo.id}/chat/receive`, `{"personaId": ${activePersonaId}, "content": "${text}"}`);
        } catch(err) {
            console.log(err);
        }
    }

    const sendNotice = async () => {
        const token = localStorage.getItem('token');
        let noticeData = {
            method: 'PUT',
            body: text,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        fetch(`${process.env.REACT_APP_SERVER_HOST}/api/lounge/notice/${roomInfo.id}`, noticeData)
            .then(response => response.json())
            .then(response => {                    
            })
            .catch(err => {
                console.log(err);
            });
        
    }

    const scrollToChattingBottom = () => {
        document.getElementById("chatting-bottom").scrollIntoView({ behavior: 'smooth' });
    }

    const receiveMessage = (msg) => { // 메세지 받기
        if (msg.persona) { // 일반 메세지라면
            if (isChattingBottom || msg.persona.id === activePersonaId) { // 마지막을 보고 있었거나, 내가 보낸 메세지라면,
                setChattingList([...chattingList, msg]); // 채팅이 왔을 때 계속 스크롤 위치를 유지하도록 함
                scrollToChattingBottom();
            } else { // 마지막을 보고 있지 않았다면
                setChattingList([...chattingList, msg]); // 그냥 채팅이 아래에 쌓이도록 함
                setNewMsgCount(newMsgCount + 1); // 새로운 메세지가 쌓임
                setShowNewMsg(true); // 새로운 메세지가 쌓였다고 알려줌
            }
        }
        if (msg.value) { // notice 공지라면
            let temp = {...roomInfo};
            // temp.notice = JSON.parse(msg.value).notice;
            temp.notice = msg.value;
            setRoomInfo(temp);
        }
    }
    
    useEffect(()=> {
        if (isChattingBottom) {
            setShowNewMsg(false);
            setNewMsgCount(0);
        }
    }, [isChattingBottom])

    return (
        <div className="lw-chatting">
            <SockJsClient
                url="http://ation-server.seohyuni.com/ws"
                topics={[`/lounge/${roomInfo.id}/chat/send`, 
                        `/lounge/${roomInfo.id}/chat/receive`, 
                        `/lounge/${roomInfo.id}/notice/receive`,
                        `/lounge/${roomInfo.id}/notice/send`]}
                onMessage={msg => { receiveMessage(msg) }} 
                ref={$websocket}
            />
            <div className="title">
                Welcome ! to [{roomInfo.title}]
            </div>
            <div className="description">이곳은 라운지의 대기실입니다. {minReady}명 이상의 크리에이터들이 준비되면 보드가 생성됩니다.</div>
            { /*<div className="today">{today.getFullYear()}년 {today.getMonth()+1}월 {today.getDate()}일</div>*/}
            <div className="chatting-wrapper">
                {
                    chattingList && chattingList.map((chat, idx)=>(
                        <>
                        {
                            (idx === 0 || dateChanged(chat.createdAt, chattingList[idx-1].createdAt) )&&
                            <div className="today">{getDate(chat.createdAt)}</div>
                        }
                        <div className="chatting-elem" key={idx}>
                            <img className="profile" src={chat.persona.profileImgPath} alt="profile" />
                            <div className="column">
                                <div className="nickname-time-wrapper">
                                    <div className="nickname">{ chat.persona.nickname }</div>
                                    <div className="time">
                                        {getTime(chat.createdAt)}
                                    </div>
                                </div>
                                <div className="content">{ chat.content }</div>
                            </div>
                        </div>
                        </>
                    ))
                }
                { showNewMsg && <div className="show-new-msg" onClick={()=>{scrollToChattingBottom()}}>읽지 않은 메세지 {newMsgCount}개 <FiArrowDown /></div> }
                <div id="chatting-bottom" ref={chattingBottom}></div>
            </div>
            <div className="notice-wrapper">
                {
                    roomInfo.notice &&
                    <div className="notice">
                        <img className="tack" src={tack_fill} alt="tack"/>
                        <div className="text">{ roomInfo.notice }</div>
                    </div>
                }
            </div>
            <div className="sample-wrapper">
                <div className="sample-text-wrapper">
                {
                    sampleList.map((sampleText, idx)=>(
                        <div className="sample-text" key={idx}
                        onClick={()=>{setText(sampleText)}}>
                            {sampleText}
                        </div>
                    ))
                }
                </div>
            </div>
            <form className="text-wrapper" onSubmit={(e)=>{sendChatting(e)}} autocomplete="off">
                <img className="tack" 
                src={isNotice ? tack_fill : tack_empty} alt="tack"
                onClick={()=>{setIsNotice(!isNotice)}}/>
                
                <input 
                    type="text"
                    value={text}
                    onChange={(e)=>(setText(e.target.value))}
                />
                <button className="send-btn" type="submit">전송</button>
            </form>
        </div>
    )

}

export default LoungeWaitChatting;