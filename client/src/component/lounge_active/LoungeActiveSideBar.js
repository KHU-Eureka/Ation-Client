import { useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as BracketLeft } from '../../assets/svg/bracket_left.svg';
import { ReactComponent as BracketRight } from '../../assets/svg/bracket_right.svg';
import { ReactComponent as MenuMember } from '../../assets/svg/menu_member.svg';
import { ReactComponent as MenuChatting } from '../../assets/svg/menu_chatting.svg';
import { ReactComponent as EmojiBtn } from '../../assets/svg/emoji_btn.svg';
import { ReactComponent as SendBtn } from '../../assets/svg/send_btn.svg';
import { BiChevronDown } from 'react-icons/bi';
import { ReactComponent as Crown } from '../../assets/svg/crown.svg';
import eye from '../../assets/svg/sense/eye.svg';
import nose from '../../assets/svg/sense/nose.svg';
import mouth from '../../assets/svg/sense/mouth.svg';
import ear from '../../assets/svg/sense/ear.svg';
import hand from '../../assets/svg/sense/hand.svg';
import "../../assets/css/lounge/LoungeActiveSideBar.css";
import axios from 'axios';

function LoungeActiveSideBar(props) {
    const { roomInfo, admin, myInfo } = props;
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

    useLayoutEffect(()=> { // lounge 채팅 불러오기
        let isMount = true;
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
                console.log(res.data);
                setChattingList(res.data);
                document.getElementById("chatting-bottom").scrollIntoView();
            } catch(err) {
                console.log(err)
            }
        }
        isMount && getLoungeChat();
        return (()=> {
            isMount=false;
        })
    }, [])
    

    return (
        <div className="lounge-start">
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
                            <div className="chatting-elem" key={idx}>
                                <img className="profile" src={chat.persona.profileImgPath} alt="profile" />
                                <div className="column">
                                    <div className="nickname-time-wrapper">
                                        <div className="nickname">{ chat.persona.nickname }</div>
                                        <div className="time">
                                            {   
                                                new Date(chat.createdAt).getHours() < 12
                                                ? "오전 " + new Date(chat.createdAt).getHours() + ":" + new Date(chat.createdAt).getMinutes()
                                                : "오후 " +  (new Date(chat.createdAt).getHours()*1 - 12) + ":" + new Date(chat.createdAt).getMinutes()
                                            }
                                        </div>
                                    </div>
                                    <div className="content">{ chat.content }</div>
                                </div>
                            </div>
                        ))
                    }
                    </div>
                    <form className="text-wrapper">
                        <input 
                            type="text"
                            value={text}
                            onChange={(e)=>(setText(e.target.value))}
                        />
                        <EmojiBtn/>
                        <SendBtn id={text.length && "active"} />
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