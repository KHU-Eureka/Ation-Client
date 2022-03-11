import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import SockJsClient from 'react-stomp';
import { ReactComponent as BracketLeft } from '../../assets/svg/bracket_left.svg';
import { ReactComponent as BracketRight } from '../../assets/svg/bracket_right.svg';
import { ReactComponent as MenuMember } from '../../assets/svg/menu_member.svg';
import { ReactComponent as MenuChatting } from '../../assets/svg/menu_chatting.svg';
import { ReactComponent as EmojiBtn } from '../../assets/svg/emoji_btn.svg';
import { ReactComponent as SendBtn } from '../../assets/svg/send_btn.svg';
import { ReactComponent as Crown } from '../../assets/svg/crown.svg';
import { FiArrowDown } from "react-icons/fi";
import { BiChevronDown } from 'react-icons/bi';
import eye from '../../assets/svg/sense/eye.svg';
import nose from '../../assets/svg/sense/nose.svg';
import mouth from '../../assets/svg/sense/mouth.svg';
import ear from '../../assets/svg/sense/ear.svg';
import hand from '../../assets/svg/sense/hand.svg';
import "../../assets/css/lounge/LoungeActiveSideBar.css";
import axios from 'axios';

function LoungeActiveSideBar(props) {
    const $websocket = useRef(null); // socket
    const { roomInfo, admin, myInfo } = props;
    const [chattingBottom, isChattingBottom] = useInView();
    const activePersonaId = useSelector(state=>state.activePersonaId);
    const senseInfoList = [
        { id: 1, name: "눈", svg: eye },
        { id: 2, name: "코", svg: nose },
        { id: 3, name: "입", svg: mouth },
        { id: 4, name: "귀", svg: ear },
        { id: 5, name: "손", svg: hand },
    ]

    //const today = new Date();
    let [currMenu, setCurrMenu] = useState(1); // sidebar menu의 id => 1 : member 목록 / 2 : chatting
    let [text, setText] = useState(''); // user text 입력
    let [chattingList, setChattingList] = useState([]); // 채팅방의 chatting List
    let [newMsgCount, setNewMsgCount] = useState(0); // 안읽은 메세지 개수
    let [showNewMsg, setShowNewMsg] = useState(false);

    const finishRoom = async () => { // 방을 종료시킴
        const token = localStorage.getItem('token');
        try {
            await axios.put(
                `${process.env.REACT_APP_SERVER_HOST}/api/lounge/${roomInfo.id}/end`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
        } catch(err) {
            console.log(err)
        }
    }

    const scrollToChattingBottom = () => {
        document.getElementById("chatting-bottom").scrollIntoView({ behavior: 'smooth' });
    }

    const receiveMessage = (msg) => {
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
    }

    const sendChatting = (e) => { // form 보내기
        e.preventDefault();
        if (text.length) { // text가 존재한다면
            sendMessage();
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

    useEffect(()=> {
        if (isChattingBottom) {
            setShowNewMsg(false);
            setNewMsgCount(0);
        }
    }, [isChattingBottom])

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
                console.log("chatting: ", res.data);
                setChattingList(res.data);
                document.getElementById("chatting-bottom").scrollIntoView();
            } catch(err) {
                console.log(err)
            }
        }
        roomInfo && getLoungeChat();

    }, [roomInfo])
    

    return (
        <div className="lounge-start">
            <SockJsClient
                url="http://ation-server.seohyuni.com/ws"
                topics={[`/lounge/${roomInfo.id}/chat/send`, 
                        `/lounge/${roomInfo.id}/chat/receive`]}
                onMessage={msg => { receiveMessage(msg) }} 
                ref={$websocket}
            />
            <div className="title-wrapper">
                <div className="title row">
                    <BracketLeft />
                        <span>
                            { roomInfo.title }
                        </span>
                    <BracketRight />
                </div>
                <BiChevronDown className="down-icon"/>
            </div>
            <div className="white-line" />
            <div className="menu-selector">
                <div className="menu-toggle" style={{left: (50*(currMenu-1))+"%"}}/>
                <MenuMember id={currMenu===1 && "selected"} onClick={()=>{setCurrMenu(1)}}/>
                <MenuChatting id={currMenu===2 && "selected"} onClick={()=>{setCurrMenu(2)}}/>
            </div>

            {
                /* member menu일 때 => member를 보여줌 */
                currMenu === 1 &&
                <div className="menu-content">
                    <div className="title">나의 활동 페르소나</div>
                    <div className="content-wrapper">
                    {
                        myInfo &&
                        <div className="member-persona row">
                            <img src={myInfo.persona.profileImgPath} alt="profile"/>
                            <div className="column grow">
                                <div className="nickname">{ myInfo.persona.nickname }</div>
                                <div className="sense-wrapper">
                                    { myInfo.persona.senseList && myInfo.persona.senseList.map((sense, idx) => (
                                        <img 
                                        className="sense-elem"    
                                        src={senseInfoList.find(elem=>elem.id===sense.senseId).svg}
                                        alt="sense" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    }
                    </div>
                    <div className="title">참여 중인 멤버</div>
                    <div className="member-wrapper column">
                        {
                            roomInfo.memberList && roomInfo.memberList.map((member, idx) => (
                                <div className="member-persona row">
                                    <img src={member.persona.profileImgPath} alt="profile"/>
                                    <div className="column grow">
                                        <div className="nickname">
                                            { member.persona.nickname }
                                            { admin && admin.id === member.persona.id && <Crown className="crown"/> }
                                        </div>
                                        <div className="sense-wrapper">
                                            { member.persona.senseList && member.persona.senseList.map((sense, idx) => (
                                                <img 
                                                className="sense-elem"    
                                                src={senseInfoList.find(elem=>elem.id===sense.senseId).svg}
                                                alt="sense" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            }

            {
                /* chatting menu일 때 => member를 보여줌 */
                currMenu === 2 &&
                <div className="menu-content">
                    <div className="chatting-wrapper">
                        {
                            chattingList && chattingList.map((chat, idx)=>(
                                /* idx가 0이거나, 이전에 채팅한 사람의 이름이 똑같지 않을 때 */
                                idx === 0 || (chattingList[idx-1].persona.id !== chat.persona.id) 
                                || Math.floor(new Date(chat.createdAt).getTime()/(1000*60)) !== Math.floor(new Date(chattingList[idx-1].createdAt).getTime() / (1000*60)))
                                ? (
                                    <>
                                    <div className="nickname-time-wrapper">
                                        <div className="nickname">{ chat.persona.nickname }</div>
                                        <div className="time">
                                            {   
                                                new Date(chat.createdAt).getHours() < 12
                                                ? "오전 " + new Date(chat.createdAt).getHours() + ":" + new Date(chat.createdAt).getMinutes()
                                                : "오후 " +  (new Date(chat.createdAt).getHours()*1 - 12) + ":" + (new Date(chat.createdAt).getMinutes().length === 1 && "0") + new Date(chat.createdAt).getMinutes()
                                            }
                                        </div>
                                        </div>
                                    <div className="content">{ chat.content }</div>
                                    </>
                                )
                                /* 계속 같은 사람이 채팅을 보냈을 경우 */
                                : (<div className="content">
                                    { chat.content }
                                </div>
                            ))
                        }
                        { showNewMsg && <div className="show-new-msg" onClick={()=>{scrollToChattingBottom()}}>읽지 않은 메세지 {newMsgCount}개 <FiArrowDown /></div> }
                        <div id="chatting-bottom" ref={chattingBottom}></div>
                    </div>
                    <form className="text-wrapper" id="text-form" onSubmit={(e)=>{sendChatting(e)}}>
                        <input 
                            type="text"
                            value={text}
                            onChange={(e)=>(setText(e.target.value))}
                        />
                        <EmojiBtn/>
                        <SendBtn id={text.length && "active"} type="submit" onClick={(e)=>{sendChatting(e)}}/>
                    </form>
                </div>
            }
            
            {
                /* 방을 종료시키는 FINISH 버튼 => 방장일 때만 누를 수 있음 */
                admin && admin.id === activePersonaId &&
                <button className="finish-btn" onClick={()=>{finishRoom()}}>
                    FINISH
                </button>
            }
        </div>
    )

}

export default LoungeActiveSideBar;