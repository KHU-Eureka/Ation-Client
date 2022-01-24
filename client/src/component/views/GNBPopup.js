import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { Cookies } from 'react-cookie';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import axios from 'axios';
import './GNBPopup.css';

function GNBPopup(props) {
    const cookies = new Cookies();
    const ref = useRef();

    let [personaList, setPersonaList] = useState([]);
    let [seeMore, setSeeMore] = useState(true); // persona 더보기 관련

    useLayoutEffect(() => {
        const getPersonaList = async () => {
            const token = cookies.get('token')
            try {
                const res = await axios.get(
                    process.env.REACT_APP_SERVER_HOST+'/api/persona', {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )
                setPersonaList(res.data)
            } catch (err) {
                console.log(err);
            }
        }
    getPersonaList();
    }, [])


    const handleCloseModal = (e) => {
        if(props.showGNBPopup && (!ref.current || !ref.current.contains(e.target)))
            props.setShowGNBPopup(false);
    }

    useEffect(()=> { // 다른 곳 누르면 창 닫히도록
        window.addEventListener('click', handleCloseModal);
        return () => {
            window.removeEventListener('click', handleCloseModal);
        }
    }, [])

    return (
        <div className={props.showGNBPopup ? "gnb-popup show-gnbpopup" : "gnb-popup hide-gnbpopup"}
        ref={ref}>
            <div className="header">
                <IoIosArrowDown 
                id="close-popup"
                onClick={()=>{props.setShowGNBPopup(false)}}/>
            </div>
            <div className="content">
                <div className="content-wrapper">
                    <div className="content-title">현재 활동중인 페르소나</div>
                    <div className="persona-preview active-persona">
                        <img className="persona-image" src={props.activePersona.profileImgPath} alt="persona profile"></img>
                        <div className="persona-name">{props.activePersona.nickname}</div>
                        <div id="close-popup">
                        { /* active persona말고 다른 persona가 있다면,, */ 
                        personaList.length > 1 && 
                            (seeMore ? 
                            <IoIosArrowUp onClick={()=>{setSeeMore(false)}}/> 
                            : <IoIosArrowDown onClick={()=>{setSeeMore(true)}}/> )
                        }
                        </div>
                    </div>
                    <div className="see-more"
                    style={seeMore ? null : {height: '0px'}}>
                    {
                        personaList && personaList.map(function(persona, idx) {
                            return (
                                persona && persona.id !== props.activePersona.id && 
                                <div 
                                className="persona-preview"
                                key={idx}
                                onClick={()=>{props.changeActivePersona(persona)}}>
                                    <img className="persona-image" src={persona.profileImgPath} alt="persona profile"></img>
                                    <div className="persona-name">{persona.nickname}</div>
                                </div>
                            )
                        })
                    }
                    </div>
                </div>
                <div className="content-wrapper">
                    <div className="content-title">로그인 계정</div>
                    <div className="email">{props.email}</div>
                </div>
            </div>
        </div>
    )
}

export default GNBPopup;