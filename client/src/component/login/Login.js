import React, { useState } from 'react';
//import { useHistory } from 'react-router-dom';
import axios from 'axios'
import { Cookies } from 'react-cookie';
import './Login.css'

function Login() {
    const cookies = new Cookies(); 
    //let history = useHistory();

    let [email, setEmail] = useState("");
    let [password, setPasssword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const login = async () => {
        try {
            const res = await axios.post(
                'http://163.180.117.22:7218/api/auth/login',
                {
                    email: email,
                    password: password,
                }
            )
            var token = res.data.token;
            cookies.set('token', token);
            alert('로그인 성공');
            getPersona(token);
        } catch (err) {
            alert('로그인 실패');
            console.log(err);
        }
    }

    const getPersona = async (token) => {
        try {
            const res = await axios.get(
                'http://163.180.117.22:7218/api/persona/user', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            // 아직 등록된 persona가 없는 경우
            if (res.data === '') {
                //history.push('/landing');
                window.location.replace('/landing')
            } else {
                //history.push('/mypage');
                window.location.replace('/mypage')
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
        </form>
    );
}

export default Login;