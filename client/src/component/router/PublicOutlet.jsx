import isValidUser from './isValidUser';
import { Outlet, Navigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useAsync } from "react-async";
import { Cookies } from 'react-cookie';

export default function PublicOutlet() {
    const dispatch = useDispatch();
    const cookies = new Cookies();
    var token = cookies.get('token');
  
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
      return <Outlet />
    } 
    if (auth.message==="Unathorized") { // 유효하지 않은 유저라면
      dispatch({type: 'AUTH', data: false});
      return <Outlet />
    } else { // 로그인 된 유저라면
      dispatch({type: 'AUTH', data: true});
      return <Navigate to="/mypage" /> ;
    }  
  }