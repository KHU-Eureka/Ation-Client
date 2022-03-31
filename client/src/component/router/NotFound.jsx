import isValidUser from './isValidUser';
import { Navigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useAsync } from "react-async";

export default function NotFound() {
    const dispatch = useDispatch();
    var token = localStorage.getItem('token');
  
    const { data: auth, error, isPending } = useAsync({
      promiseFn: isValidUser,
      token: token,
      watch: token
    });
  
    if (isPending) {
      return <div>로딩중</div>
    } 
    if (error) { // 에러 발생 시 login으로 이동
      dispatch({type: 'AUTH', data: false});
      // return <Navigate to="/login" />
    } 
    if (auth !== undefined && auth.message==="Unathorized") { // 유효하지 않은 유저라면
      dispatch({type: 'AUTH', data: false});
      return <Navigate to="/landing" />
    } else { // 로그인 된 유저라면
      dispatch({type: 'AUTH', data: true});
      return <Navigate to="/mypage" /> ;
    }  
  }