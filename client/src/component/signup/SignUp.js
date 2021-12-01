import React, { useState } from 'react';
import './SignUp.css'

function SignUp() {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [passwordCheck, setPasswordCheck] = useState("");



    return (
        <form class="form-wrapper">
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
                    type="text"
                    placeholder="이메일 주소"
                    onChange={(e)=>{ setEmail(e.target.value) } }
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
                    onChange={ (e)=>{ setPassword(e.target.value) } }
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
                    placeholder="비밀번호 확인"
                    onChange={ (e)=>{ setPasswordCheck(e.target.value) } }
                />
            </div>


            <button className="login-submit"
            type="submit">
                센세이션 시작하기
            </button>
        </form>
    );
}

export default SignUp;
