import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios'
import { Cookies } from 'react-cookie';
import logo from '../../asset/images/logo.png';
import './Login.css'

function Login() {
    const cookies = new Cookies(); 
    const navigate = useNavigate();
    let dispatch = useDispatch();

    let [email, setEmail] = useState("");
    let [password, setPasssword] = useState("");

    let [showLoginAlertMsg, setShowLoginAlertMsg] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
    }
    useEffect(() => {
        setShowLoginAlertMsg(false);
    }, [email, password])

    const login = async () => {
        try {
            const res = await axios.post(
                process.env.REACT_APP_SERVER_HOST+'/api/auth/login',
                {
                    email: email,
                    password: password,
                }
            )
            var token = res.data.token;
            var name = res.data.name;
            cookies.set('token', token); // 받은 token을 cookie에 저장
            getPersona(token, name); // user의 active persona 정보를 얻음
        } catch (err) {
            setShowLoginAlertMsg(true);
            console.log(err);
        }
    }

    const getPersona = async (token, name) => {
        try {
            const res = await axios.get(
                process.env.REACT_APP_SERVER_HOST+'/api/persona/user', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            // 아직 등록된 persona가 없는 경우
            if (res.data === '') {
                navigate('/landing', { state: { welcome: true, name: name } })
            } else {
                dispatch({type: 'CHANGEPERSONA', data: res.data.id})
                navigate('/mypage')
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <form className="login form-wrapper" onSubmit={ handleSubmit }>
            <img className="logo-img" src={logo} alt="logo"></img>
            <div className="input-wrapper">
                <label htmlFor="id" className="input-label">
                    아이디(이메일)
                </label>
                <input
                    className="login-input"
                    id="id"
                    type="text"
                    placeholder="이메일 주소"
                    onChange={ (e)=>{ setEmail(e.target.value) } }
                    required
                />
            </div>

            <div className="input-wrapper">
                <label htmlFor="password" className="input-label">
                    비밀번호
                </label>
                <input
                    className="login-input"
                    id="password"
                    type="password"
                    placeholder="비밀번호"
                    onChange={ (e)=>{ setPasssword(e.target.value) } }
                    required
                />
            </div>
            <button className="login-submit"
            type="submit"
            onClick={ login }
            >
                { showLoginAlertMsg && 
                    <div className="alert-msg bounce">
                    아이디 또는 비밀번호가 잘못 입력 되었습니다.<br/> 아이디와 비밀번호를 정확히 입력해 주세요.
                    </div>
                }
                로그인 하기
            </button>
            <div style={{cursor: "pointer"}} onClick={()=>{navigate('/signup')}}>회원가입 하기</div>
        </form>
    );
}

export default Login;