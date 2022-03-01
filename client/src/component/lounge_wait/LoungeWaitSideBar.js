import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Cookies } from "react-cookie";
import axios from 'axios';

import { ReactComponent as BracketLeft } from '../../assets/svg/bracket_left.svg';
import { ReactComponent as BracketRight } from '../../assets/svg/bracket_right.svg';
import exclamation from '../../assets/image/exclamation.png';
import { BiChevronDown } from 'react-icons/bi';
import { BsCheck2 } from 'react-icons/bs';
import { AiOutlineExclamation } from 'react-icons/ai';
import "../../assets/css/lounge/LoungeWaitSideBar.css";

import { ReactComponent as Crown } from '../../assets/svg/crown.svg';
import eye from '../../assets/svg/sense/eye.svg';
import nose from '../../assets/svg/sense/nose.svg';
import mouth from '../../assets/svg/sense/mouth.svg';
import ear from '../../assets/svg/sense/ear.svg';
import hand from '../../assets/svg/sense/hand.svg';

function LoungeWaitSideBar(props) {
    const cookies = new Cookies();
    const { roomInfo, setRoomInfo } = props;
    const activePersonaId = useSelector(state=>state.activePersonaId);

    const senseInfoList = [
      { id: 1, name: "눈", svg: eye },
      { id: 2, name: "코", svg: nose },
      { id: 3, name: "입", svg: mouth },
      { id: 4, name: "귀", svg: ear },
      { id: 5, name: "손", svg: hand },
    ]

    let [ admin, setAdmin ] = useState({}); // 방장
    let [showAlertBlock, setShowAlertBlock] = useState(true);
    let [canStart, setCanStart] = useState(false);

    let [ tempMemberList, setTempMemberList ] = useState([
        {
            "ready": true,
            "admin": false,
            "persona": {
              "id": 5,
              "nickname": "안녕하세용가리용가리용가리용가리",
              "profileImgPath": "http://52.78.105.195:8081/api/image?path=/home/ec2-user/Ation-Server/src/main/resources/image/persona-5.png",
              "senseList": [
                {
                  "senseId": 2,
                  "name": "코"
                },
                {
                  "senseId": 4,
                  "name": "손"
                }
              ],
              "job": "프론트엔드 개발자"
            }
          },
          {
            "ready": true,
            "admin": false,
            "persona": {
              "id": 5,
              "nickname": "방울토망토",
              "profileImgPath": "http://52.78.105.195:8081/api/image?path=/home/ec2-user/Ation-Server/src/main/resources/image/persona-5.png",
              "senseList": [
                {
                  "senseId": 2,
                  "name": "코"
                },
                {
                  "senseId": 4,
                  "name": "손"
                }
              ],
              "job": "프론트엔드 개발자"
            }
          },
          {
            "ready": false,
            "admin": false,
            "persona": {
              "id": 5,
              "nickname": "hello world",
              "profileImgPath": "http://52.78.105.195:8081/api/image?path=/home/ec2-user/Ation-Server/src/main/resources/image/persona-5.png",
              "senseList": [
                {
                  "senseId": 2,
                  "name": "코"
                },
                {
                  "senseId": 4,
                  "name": "손"
                }
              ],
              "job": "프론트엔드 개발자"
            }
          },
          {
            "ready": true,
            "admin": false,
            "persona": {
              "id": 5,
              "nickname": "방울토망토",
              "profileImgPath": "http://52.78.105.195:8081/api/image?path=/home/ec2-user/Ation-Server/src/main/resources/image/persona-5.png",
              "senseList": [
                {
                  "senseId": 2,
                  "name": "코"
                },
                {
                  "senseId": 4,
                  "name": "손"
                }
              ],
              "job": "프론트엔드 개발자"
            }
          },
          {
            "ready": false,
            "admin": false,
            "persona": {
              "id": 5,
              "nickname": "방울토망토",
              "profileImgPath": "http://52.78.105.195:8081/api/image?path=/home/ec2-user/Ation-Server/src/main/resources/image/persona-5.png",
              "senseList": [
                {
                  "senseId": 2,
                  "name": "코"
                },
                {
                  "senseId": 4,
                  "name": "손"
                }
              ],
              "job": "프론트엔드 개발자"
            }
          },
          {
            "ready": true,
            "admin": false,
            "persona": {
              "id": 5,
              "nickname": "방울토망토",
              "profileImgPath": "http://52.78.105.195:8081/api/image?path=/home/ec2-user/Ation-Server/src/main/resources/image/persona-5.png",
              "senseList": [
                {
                  "senseId": 2,
                  "name": "코"
                },
                {
                  "senseId": 4,
                  "name": "손"
                }
              ],
              "job": "프론트엔드 개발자"
            }
          },
          {
            "ready": true,
            "admin": false,
            "persona": {
              "id": 5,
              "nickname": "방울토망토",
              "profileImgPath": "http://52.78.105.195:8081/api/image?path=/home/ec2-user/Ation-Server/src/main/resources/image/persona-5.png",
              "senseList": [
                {
                  "senseId": 2,
                  "name": "코"
                },
                {
                  "senseId": 4,
                  "name": "손"
                }
              ],
              "job": "프론트엔드 개발자"
            }
          }
    ])

    const startHandler = async () => {
      if (canStart) { // 시작이 가능할 때
        try {
          const token = cookies.get('token')
          await axios.put(
            `${process.env.REACT_APP_SERVER_HOST}/api/lounge/${roomInfo.id}/start`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          let tempRoomInfo = {...roomInfo}
          tempRoomInfo.status = 'START'
          setRoomInfo(tempRoomInfo)
        } catch(err) {
          console.log(err)
        }
      } else { // 시작이 불가능할 때
        setShowAlertBlock(true)
      }
    }

    const readyHandler = async (isReady) => {
      try {
        const token = cookies.get('token')
        let tempRoomInfo = {...roomInfo}

        if (isReady) { // ready인 상태였으면 => unready 시킴
          await axios.put(
            `${process.env.REACT_APP_SERVER_HOST}/api/lounge/${roomInfo.id}/ready/${activePersonaId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          // 자신을 unready 시키는 코드
          tempRoomInfo.memberList.find(elem=>elem.persona.id===activePersonaId).ready = false
        } else { // unready인 상태였으면 => ready 시킴
          await axios.put(
            `${process.env.REACT_APP_SERVER_HOST}/api/lounge/${roomInfo.id}/start/${activePersonaId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          // 자신을 ready 시키는 코드
          tempRoomInfo.memberList.find(elem=>elem.persona.id===activePersonaId).ready = true
        }
        setRoomInfo(tempRoomInfo)
      } catch(err) {
        console.log(err)
      }
    }

    useEffect(()=> { // 방장이 방을 시작 할 수 있는지 구하기
      if (roomInfo.limitMember) {
        const readyMember = roomInfo.memberList.filter((elem)=>elem.ready).length

        if (readyMember * 3 >= roomInfo.limitMember) setCanStart(true)
        else setCanStart(false)

      } else {
        setCanStart(true)
      }
    }, [roomInfo.memberList])


    useLayoutEffect(()=> {
        // 방장을 따로 저장
        if (roomInfo) {
            setAdmin(roomInfo.memberList.find((elem)=>elem.admin).persona)
        }
    }, [roomInfo])

    useEffect(()=> {
      document.addEventListener('click', setShowAlertBlock(false))

      return (()=> {
        document.removeEventListener('click', setShowAlertBlock(false))
      })
    }, [])


    return (
        <div className="lounge-sidebar">
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

            <div className="title">활동 중인 페르소나</div>
            <div className="content-wrapper">
                <div className="active-persona row">
                    <img src={roomInfo.persona.profileImgPath} alt="profile"></img>
                    <div className="column grow">
                        <div className="nickname">{ roomInfo.persona.nickname }</div>
                        <div className="sense-wrapper">
                            { roomInfo.persona.senseList && roomInfo.persona.senseList.map((sense, idx) => (
                                <img 
                                className="sense-elem"    
                                src={senseInfoList.find(elem=>elem.id===sense.senseId).svg}
                                alt="sense" />
                            ))}
                        </div>
                    </div>
                    <BiChevronDown className="down-icon"/>
                </div>
            </div>
            {
              admin.id === activePersonaId
              /* 방장일 때 => START 버튼 */
              ? <button className="action-btn" disabled={!canStart} onClick={startHandler}>
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
              : <button className="action-btn" disabled="true"
                onClick={()=>{readyHandler(roomInfo.memberList.find(elem=>elem.persona.id===activePersonaId).ready)}}>READY</button>
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
                    roomInfo.memberList && roomInfo.memberList.map((member, idx) => (
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
                {/*
                    tempMemberList.map((member, idx) => (
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
                */}
            </div>
            <div>

            </div>

        </div>
    )

}

export default LoungeWaitSideBar;