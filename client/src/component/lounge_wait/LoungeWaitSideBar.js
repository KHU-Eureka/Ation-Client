import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';
import RoomSetting from "../lounge_active/RoomSetting";
import { ReactComponent as BracketLeft } from '../../assets/svg/bracket_left.svg';
import { ReactComponent as BracketRight } from '../../assets/svg/bracket_right.svg';
import exclamation from '../../assets/image/exclamation.png';
import { BiChevronDown } from 'react-icons/bi';
import { BsCheck2 } from 'react-icons/bs';
import "../../assets/css/lounge/LoungeWaitSideBar.css";

import { ReactComponent as Crown } from '../../assets/svg/crown.svg';
import eye from '../../assets/svg/sense/eye.svg';
import nose from '../../assets/svg/sense/nose.svg';
import mouth from '../../assets/svg/sense/mouth.svg';
import ear from '../../assets/svg/sense/ear.svg';
import hand from '../../assets/svg/sense/hand.svg';

function LoungeWaitSideBar(props) {
    const { roomInfo, memberList, admin, myInfo, setShowRoomInfoModal } = props;
    const activePersonaId = useSelector(state=>state.activePersonaId);
    let alertRef = useRef();

    const senseInfoList = [
      { id: 1, name: "눈", svg: eye },
      { id: 2, name: "코", svg: nose },
      { id: 3, name: "입", svg: mouth },
      { id: 4, name: "귀", svg: ear },
      { id: 5, name: "손", svg: hand },
    ]

    let [ showAlertBlock, setShowAlertBlock ] = useState(false); // can't start alert block
    let [canStart, setCanStart] = useState(false); // 방장이 방을 시작할 수 있는지..
    let [showToggle, setShowToggle] = useState(false); // title 옆 toogle

    const startHandler = async () => {
      if (canStart) { // 시작이 가능할 때
        try { // 시작 socket을 보냄
          const token = localStorage.getItem('token')
          await axios.put(
            `${process.env.REACT_APP_SERVER_HOST}/api/lounge/${roomInfo.id}/start`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
        } catch(err) {
          console.log(err)
        }
      } else { // 시작이 불가능할 때
        setShowAlertBlock(true)
      }
    }

    const readyHandler = async (isReady) => {
      try {
        const token = localStorage.getItem('token')
        if (isReady) { // ready인 상태였으면 => unready 시킴
          await axios.put(
            `${process.env.REACT_APP_SERVER_HOST}/api/lounge/${roomInfo.id}/unready/${activePersonaId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
        } else { // unready인 상태였으면 => ready 시킴
          await axios.put(
            `${process.env.REACT_APP_SERVER_HOST}/api/lounge/${roomInfo.id}/ready/${activePersonaId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
        }
      } catch(err) {
        console.log(err)
      }
    }
    
    useEffect(()=> { // 방장이 방을 시작 할 수 있는지 구하기
      if (roomInfo && memberList) {
        const readyMember = memberList.filter((elem)=>elem.ready).length
        if (readyMember * 3 >= roomInfo.limitMember) setCanStart(true)
        else setCanStart(false)
      } else {
        setCanStart(true)
      }
    }, [memberList, roomInfo])
    
    const clickAlertBlockOutside = (e) => {
      if (!alertRef.current.contains(e.target)) {
        setShowAlertBlock(false);
      }
    }

    useEffect(()=> {
      document.addEventListener('click', clickAlertBlockOutside)

      return (()=> {
        document.removeEventListener('click', clickAlertBlockOutside)
      })
    }, [])


    return (
        <div >
          {/* member status 관련 socket */}
            <div className="title-wrapper">
                <div className="title row">
                    <BracketLeft />
                        <span>
                            { roomInfo.title }
                        </span>
                    <BracketRight />
                </div>
                <div className="room-info" onClick={()=>{setShowToggle(true)}}>
                    <BiChevronDown className="down-icon"/>
                    { showToggle && <RoomSetting roomId={roomInfo.id} showToggle={showToggle} setShowToggle={setShowToggle} setShowRoomInfoModal={setShowRoomInfoModal}/> }
                </div>
            </div>

            <div className="title">활동 중인 페르소나</div>
            <div className="content-wrapper">
              {
                myInfo &&
                <div className="active-persona row">
                    <img src={myInfo.persona.profileImgPath} alt="profile"></img>
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
            {
              admin && (admin.id === activePersonaId)
              /* 방장일 때 => START 버튼 */
              ? <button className="action-btn" id={!canStart && "disabled"} onClick={()=>{startHandler()}} ref={alertRef}>
                  START
                  {
                    showAlertBlock &&
                    <div className="alert-block">
                      <img className="icon" src={exclamation} alt="!"/>
                      <span className="text">대기 멤버의 1/3이상이 레디해야 시작할 수 있습니다.</span>
                    </div>
                  }
                </button>
              /* 멤버일 때 => READY 버튼 */
              : <button className="action-btn" id={myInfo && myInfo.ready && "ready"}
                onClick={()=>{readyHandler(myInfo && myInfo.ready)}}>READY</button>
            }

            <div className="title">참여중인 멤버</div>
            {
              /* 방장 */
                admin &&
                <div className="member-persona row" id="admin">
                    <img src={admin.profileImgPath} alt="profile"/>
                    <div className="column grow">
                        <div className="nickname">{ admin.nickname }<Crown className="crown"/></div>
                        <div className="sense-wrapper">
                            { admin.senseList && admin.senseList.map((sense, idx) => (
                                <img 
                                className="sense-elem"    
                                src={senseInfoList.find(elem=>elem.id===sense.senseId).svg}
                                alt="sense" />
                            ))}
                        </div>
                    </div>
                </div>
            }
            <div className="member-wrapper column">
                {
                    memberList && memberList.map((member, idx) => (
                        !member.admin && (
                        <div className="member-persona row">
                            <img src={member.persona.profileImgPath} alt="profile"/>
                            <div className="column grow">
                                <div className="nickname">{ member.persona.nickname }</div>
                                <div className="sense-wrapper">
                                    { member.persona.senseList && member.persona.senseList.map((sense, idx) => (
                                        <img 
                                        className="sense-elem"    
                                        src={senseInfoList.find(elem=>elem.id===sense.senseId).svg}
                                        alt="sense" />
                                    ))}
                                </div>
                            </div>
                            <div className="status" id={member.ready && "ready"}><BsCheck2/></div>
                        </div>
                        )
                    ))
                }
            </div>
            <div>

            </div>

        </div>
    )

}

export default LoungeWaitSideBar;