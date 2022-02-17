import isValidUser from './isValidUser';
import { Outlet, Navigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useAsync } from "react-async";
import { Cookies } from 'react-cookie';

export default function PrivateOutlet() {
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
    if (error) {
      dispatch({type: 'AUTH', data: false});
      return <Navigate to="/login" />
      //return <Navigate to="/login" />
    } 
    if (auth.message==="Unathorized") { // 로그인 되지 않거나 유효하지 않은 유저라면,
      dispatch({type: 'AUTH', data: false});
      return <Navigate to="/login" />
    } else { // 유효한 유저라면,
      dispatch({type: 'AUTH', data: true});
      return <Outlet /> ;
    }  
  }