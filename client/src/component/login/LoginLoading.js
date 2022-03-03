import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import QueryString from 'qs';

function LoginLoading() {
    const location = useLocation();
    const cookies = new Cookies(); 
    const navigate = useNavigate();
    const dispatch = useDispatch();

    let [name, setName] = useState('');

    useEffect(()=> {
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
                } else { // 등록된 persona가 있는 경우
                    dispatch({type: 'CHANGEPERSONA', data: res.data.id}) // persona 설정해주고
                    navigate('/mypage') // my page로 이동
                }
            } catch (err) {
                console.log(err);
            }
        }

        const getName = async (token) => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_SERVER_HOST}/api/auth/user`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                getPersona(token, res.data.name); // persona를 받음
            } catch(err) {
                console.log(err);
            }

        }
        console.log(QueryString.parse(location.search, { ignoreQueryPrefix: true }).JSESSIONID)
        const token = QueryString.parse(location.search, { ignoreQueryPrefix: true }).token;
        cookies.set('token', token); // 받은 token을 cookie에 저장
        // localStorage.setItem('token', token);
        getName(token); // 이름을 받고
        dispatch({type: 'AUTH', data: true}); // AUTH를 true로 변경
    },[])

    return (
        <div>
            로딩중 입니다...
        </div>
    )
}

export default LoginLoading;