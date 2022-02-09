import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { Cookies, useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import axios from 'axios';
import '../../assets/css/GNBPopup.css';

function GNBPopup(props) {
    const cookies = new Cookies();
    const [cookie, setCookie, removeCookie] = useCookies(['token'])
    let auth = useSelector((state) => state.auth);
    let dispatch = useDispatch();
    const ref = useRef();
    const navigation = useNavigate();

    let [personaList, setPersonaList] = useState([]);

    const logOut = () => {
        removeCookie('token');
        dispatch({type: 'AUTH', data: false});
        dispatch({type: 'MENU', data: ''});
        navigation('/login');
        localStorage.setItem('target', '');
    }

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
        <div className="gnb-popup"
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
                    </div>
                    <div className="see-more">
                    {
                        personaList && personaList.map(function(persona, idx) {
                            return (
                                persona && persona.id !== props.activePersona.id && 
                                <div 
                                className="persona-preview"
                                key={idx}
                                onClick={()=>{props.changeActivePersona(persona); props.setShowGNBPopup(false)}}>
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
                <div className="logout"
                onClick={()=>logOut()}>로그아웃</div>
            </div>
        </div>
    )
}

export default GNBPopup;