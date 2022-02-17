import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "../../assets/css/lounge/Lounge.css";

function Lounge() {
    const dispatch = useDispatch();

    useEffect(()=> {
        dispatch({type: 'MENU', data: 'lounge'});
    }, [])

    return (
        <div className="lounge">
            여기는 라운지 페이지 입니다.
        </div>
    )
}

export default Lounge;