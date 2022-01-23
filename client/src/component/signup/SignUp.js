import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../views/Alert';
import axios from 'axios';
import './SignUp.css'

function SignUp() {
    const navigation = useNavigate();

    let [email, setEmail] = useState("");
    let [name, setName] = useState("");
    let [password, setPassword] = useState("");
    let [passwordCheck, setPasswordCheck] = useState("");

    // alert 관련
    let [showAlert, setShowAlert] = useState(false);
    let [alertTitle, setAlertTitle] = useState("");
    let [alertSubtitle, setAlertSubtitle] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const isEmail = (email) => {
        const emailRegex =
          /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    
        return emailRegex.test(email);
      };

    const checkUserInfo = () => {
        if (!isEmail(email)) {
            setAlertTitle("아이디가 이메일 형식이 아닙니다.")
            setAlertSubtitle("다시 시도해주세요")
            setShowAlert(true)
        } else if (name.length === 0 ) {
            setAlertTitle("이름을 입력해주세요.")
            setAlertSubtitle("")
            setShowAlert(true)
        } else if (password !== passwordCheck) {
            setAlertTitle("비밀번호가 다릅니다.")
            setAlertSubtitle("비밀번호를 확인해주세요")
            setShowAlert(true)
        } else if (password.length < 3) {
            setAlertTitle("비밀번호는 3자리 이상이어야 합니다.")
            setAlertSubtitle("비밀번호를 다시 입력해주세요")
            setShowAlert(true)
        } else {
            postUserInfo();
        }
    }

    const postUserInfo = async () => {
        try {
            await axios.post(
                process.env.REACT_APP_SERVER_HOST+'/api/auth/signup',
                {
                    email: email,
                    name: name,
                    password: password
                }
            )
            navigation('/login', { replace: true })
        } catch (err) {
            setAlertTitle("회원가입에 실패했습니다")
            setAlertSubtitle("다시 시도해주세요")
            setShowAlert(true)
            console.log(err);
        }
    }



    return (
        <form className="signup form-wrapper" style={{width:'297px'}} onSubmit={ handleSubmit }>
            <Alert alertTitle={alertTitle} alertSubtitle={alertSubtitle} showAlert={showAlert} setShowAlert={setShowAlert}/>
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
                    minLength="3"
                    placeholder="비밀번호를 입력해주세요.(3자리 이상)"
                    onChange={ (e)=>{ setPassword(e.target.value) } }
                    required
                />
            </div>

            <div className="input-wrapper password-check">
                <label htmlFor="password-check" className="input-label">
                    비밀번호 확인
                </label>
                <input
                    className="login-input"
                    id="password-check"
                    type="password"
                    minLength="3"
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
            onClick={ checkUserInfo }
            >
                센세이션 시작하기
            </button>
        </form>
    );
}

export default SignUp;
