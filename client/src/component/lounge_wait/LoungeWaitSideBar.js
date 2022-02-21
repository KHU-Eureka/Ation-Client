import { useEffect, useLayoutEffect, useState } from "react";
import { ReactComponent as BracketLeft } from '../../assets/svg/bracket_left.svg';
import { ReactComponent as BracketRight } from '../../assets/svg/bracket_right.svg';
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
    const { roomInfo } = props;
    let [ admin, setAdmin ] = useState({}); // 방장

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
            "ready": true,
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


    useLayoutEffect(()=> {
        // 방장을 따로 저장
        if (roomInfo) {
            setAdmin(roomInfo.memberList.find((elem)=>elem.admin).persona)
        }
        
    }, [roomInfo])

    const senseInfoList = [
        { id: 1, name: "눈", svg: eye },
        { id: 2, name: "코", svg: nose },
        { id: 3, name: "입", svg: mouth },
        { id: 4, name: "귀", svg: ear },
        { id: 5, name: "손", svg: hand },
    ]

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

            <button className="action-btn">START</button>

            <div className="title">참여중인 멤버</div>
            {
                    admin &&
                <div className="member-persona row" id="admin">
                    <img src={admin.profileImgPath} alt="profile"/>
                    <div className="column grow">
                        <div className="nickname">{ admin.nickname }</div>
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
                {
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
                }
            </div>
            <div>

            </div>

        </div>
    )

}

export default LoungeWaitSideBar;