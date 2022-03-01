import { useState, useEffect, useLayoutEffect } from "react";
import socketIOClient from "socket.io-client";
import { Cookies } from "react-cookie";
import axios from "axios";

import tack_empty from "../../assets/image/tack_empty.png";
import tack_fill from "../../assets/image/tack_fill.png";
import "../../assets/css/lounge/LoungeWaitChatting.css";

function LoungeWaitChatting(props) {
    const cookies = new Cookies();
    const { roomInfo, setRoomInfo } = props;
    const sampleList = [
        '안녕하세요 :)', '열띤 토론 한번 해봅시다!', '엠비티아이 소개해주세요 !',
        '각자 맡은 역할 말해주세요 !', '매너 있는 대화 해요 :)', '주제에 대해 더 설명해주세요'
    ]
    let [currentSocket, setCurrentSocket] = useState();
    let [today, setToday] = useState(new Date());
    let [chattingList, setChattingList] = useState([]);
    let [minReady, setMinReady] = useState(0);
    let [text, setText] = useState(''); // user가 채팅에 입력하는 text
    let [isNotice, setIsNotice] = useState(false); // user가 채팅에 입력하는 text가 공지인지

    const sendChatting = (e) => {
        e.preventDefault();
        console.log(text)
    }

    useEffect(()=> { // 최소 ready 멤버 명 수 구하기
        setMinReady(Math.ceil(roomInfo.limitMember/3)) // limit member의 1/3 이상
    }, [roomInfo.limitMember])

    useLayoutEffect(()=> {
        const getLoungeChat = async () => {
            const token = cookies.get('token')
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_SERVER_HOST}/api/lounge/${roomInfo.id}/chat`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                setChattingList(res.data);
            } catch(err) {
                console.log(err)
            }
        }
        getLoungeChat();
    }, [])

    useEffect(() => {
        setCurrentSocket(socketIOClient('http://ation-server.seohyuni.com/ws/lounge/1/chat/send'));
    }, []);


    return (
        <div className="lw-chatting">
            <div className="title">
                Welcome ! to [{roomInfo.title}]
            </div>
            <div className="description">이곳은 라운지의 대기실입니다. {minReady}명 이상의 크리에이터들이 준비되면 보드가 생성됩니다.</div>
            <div className="today">{today.getFullYear()}년 {today.getMonth()+1}월 {today.getDate()}일</div>
            <div className="chatting-wrapper">
                {
                    chattingList && chattingList.map((chat, idx)=>(
                        <div className="chatting-elem" key={idx}>
                            <img className="profile" src={chat.persona.profileImgPath} alt="profile" />
                            <div className="column">
                                <div className="nickname-time-wrapper">
                                    <div className="nickname">{ chat.persona.nickname }</div>
                                    <div className="time">오후 어쩌고</div>
                                </div>
                                <div className="content">{ chat.content }</div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="notice-wrapper">
                <div className="notice">
                    <img className="tack" src={tack_fill} alt="tack"/>
                    <div className="text">text</div>
                </div>
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
            <form className="text-wrapper" onSubmit={(e)=>{sendChatting(e)}}>
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