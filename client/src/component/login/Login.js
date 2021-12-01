import React, { useState } from 'react';
import WelcomeModal from './WelcomeModal';
import './Login.css'

function Login() {
    let [email, setEmail] = useState("email");
    let [password, setPasssword] = useState("password");
    let [welcomeModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    return (
        <form className="form-wrapper">
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
                    onChange={ (e)=>{ setPasssword(e.target.password) } }
                />
            </div>

            <button className="login-submit"
            type="submit"
            onClick={ openModal }
            >
                로그인 하기
            </button>
            { welcomeModal && <WelcomeModal closeModal={closeModal}></WelcomeModal> }

        </form>
    );
}

export default Login;