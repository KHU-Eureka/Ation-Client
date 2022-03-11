import { useEffect, useState, useRef } from "react";
import './LoungeStartModal.css';
import { ReactComponent as BracketLeft } from '../../assets/svg/bracket_left.svg';
import { ReactComponent as BracketRight } from '../../assets/svg/bracket_right.svg';
import loungeStart from '../../assets/image/lounge_start.png';

function LoungeStartModal(props) {

    const { roomTitle, startRoom, exitRoom, setShowModal } = props;
    //let [time, setTime] = useState(10);
    let [sec, setSec] = useState(10);
    const time = useRef(10);
    const timerId = useRef(null);

    useEffect(()=> {
        timerId.current = setInterval(()=>{
            console.log("hello")
            setSec(time.current);
            time.current -= 1; // 1초씩 count down
        }, 1000)
        return () => clearInterval(timerId.current)
    }, [])

    useEffect(()=> {
        if (time.current < 0) { // 10초가 모두 지난다면
            console.log('time out')
            clearInterval(timerId.current)
            startRoom() // 방을 시작시키고,
            setShowModal(false) // modal창 닫음
        }
    }, [time.current])

    return (
        <div className="lounge-start">
            <div className="modal-background">
                <div className="modal-wrapper">
                    <div className="modal-content">
                        <div className="show-second">
                            <b>{sec}초</b> 뒤에
                            <b className="room-title">
                                <BracketLeft/>
                                { roomTitle }
                                <BracketRight/>
                            </b>
                            이 시작됩니다.
                        </div>
                        <div>Have a sensation talk !</div>
                        <button 
                        className="exit-btn"
                        onClick={()=>{exitRoom()}}>
                            퇴장하기
                        </button>
                    </div>
                    <img className="modal-img" src={loungeStart} alt="lounge start"/>
                </div>
            </div>
        </div>
    )
}

export default LoungeStartModal;