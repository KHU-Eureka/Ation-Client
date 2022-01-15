import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css'

function SignUp() {
    const navigation = useNavigate();

    let [email, setEmail] = useState("");
    let [name, setName] = useState("");
    let [password, setPassword] = useState("");
    let [passwordCheck, setPasswordCheck] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const postUserInfo = async () => {
        try {
            const res = await axios.post(
                'http://163.180.117.22:7218/api/auth/signup',
                {
                    email: email,
                    name: name,
                    password: password
                }
            )
            alert("회원가입 되었습니다.");
            navigation('/login', { replace: true })
        } catch (err) {
            alert("회원가입에 실패했습니다");
            console.log(err);
        }
    }



    return (
        <form class="form-wrapper" style={{width:'297px'}} onSubmit={ handleSubmit }>
            <div className="title">
                회원가입
            </div>

            <div className="input-wrapper">
                <label htmlFor="id" className="input-label">
                    아이디(이메일)
                </label>
                <input
                    className="login-input"
                    id="id"
                    type="email"
                    placeholder="이메일 주소를 입력해주세요."
                    onChange={(e)=>{ setEmail(e.target.value) } }
                    required
                />
            </div>

            <div className="input-wrapper">
                <label htmlFor="name" className="input-label">
                    이름
                </label>
                <input
                    className="login-input"
                    id="name"
                    type="text"
                    placeholder="이름을 입력해주세요."
                    onChange={(e)=>{ setName(e.target.value) } }
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
                    placeholder="비밀번호를 입력해주세요.(3자리 이상)"
                    onChange={ (e)=>{ setPassword(e.target.value) } }
                    required
                />
            </div>

            <div className="input-wrapper">
                <label htmlFor="password-check" className="input-label">
                    비밀번호 확인
                </label>
                <input
                    className="login-input"
                    id="password-check"
                    type="password"
                    placeholder="비밀번호를 확인해주세요."
                    onChange={ (e)=>{ setPasswordCheck(e.target.value) } }
                    required
                />
                {
                password === passwordCheck
                ? (password !== "") && <div className="alert-msg" style={{color: 'green'}}>비밀번호가 일치합니다.</div>
                : (passwordCheck !== "") && <div className="alert-msg" style={{color: 'red'}}>비밀번호가 일치하지 않습니다.</div>
                }
            </div>




            <button className="login-submit"
            type="submit"
            onClick={ postUserInfo }
            >
                센세이션 시작하기
            </button>
        </form>
    );
}

export default SignUp;
