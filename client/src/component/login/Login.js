import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Cookies } from 'react-cookie';
import './Login.css'

function Login() {
    const cookies = new Cookies(); 
    const navigate = useNavigate();

    let [email, setEmail] = useState("");
    let [password, setPasssword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }

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
                window.location.reload()
            } else {
                navigate('/mypage')
                window.location.reload()
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <form className="form-wrapper" onSubmit={ handleSubmit }>
            <div className="logo">
                Senstation
            </div>
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
                로그인 하기
            </button>
            <div onClick={()=>{navigate('/signup')}}>회원가입 하기</div>
        </form>
    );
}

export default Login;