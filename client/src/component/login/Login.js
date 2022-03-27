import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/image/logo.png';
import { ReactComponent as Logo } from '../../assets/svg/logo.svg';
import { ReactComponent as Google } from '../../assets/svg/google.svg';
import { ReactComponent as Kakao } from '../../assets/svg/kakao.svg';
import '../../assets/css/Login.css';
import { useDispatch } from 'react-redux';

function Login() {
    const login = useRef();
    const dispatch = useDispatch();

    const closeLoginModal = (e) => {
        if (!login.current.contains(e.target)) {
            dispatch({type: 'LOGIN', data: false});
        }
    }

    useEffect(()=> {
        document.addEventListener('click', closeLoginModal)

        return (()=> {
            document.removeEventListener('click', closeLoginModal)
        })
    }, [])

    return (
        <form className="modal-background login">
            <div className="modal-wrapper" ref={login}>
                <div className="modal-content">
                    <Logo className="logo"/>
                    <div className="modal-sub-title">
                        지금 바로 가입하고 센세이션한 아이디어를 공유해보세요.
                    </div>
                    <a className="sl-btn" id="google" href={`${process.env.REACT_APP_SERVER_HOST}/oauth2/authorization/google`}>
                        <Google/>구글 로그인
                    </a>
                    <a className="sl-btn" id="kakao" href={`${process.env.REACT_APP_SERVER_HOST}/oauth2/authorization/kakao`}>
                        <Kakao />kakao 로그인
                    </a>
                </div>
                
                <div className="modal-footer">
                    <div className="modal-description">
                        로그인은 개인 정보 보호 정책 및 서비스 약관에 동의하는 것을 의미하며,<br/>
                        서비스 이용을 위해 이메일과 이름, 프로필 이미지를 수집합니다.
                    </div>
                </div>
            </div>
        </form>
    );
}

export default Login;