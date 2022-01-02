import React, {useState, useEffect} from "react";
import { BsCheck2 } from "react-icons/bs";
import './Alert.css';

function Alert(props) {
    let [time, setTime] = useState(0)

    useEffect( () => { // 2초 띄우고 다시 위로 올림
        const interval = setInterval(() => {
            setTime(time+1)
            if (time === 2) {
                props.setShowAlert(false)
            }
        }, 1000)
        return () => {clearInterval(interval)}
    }, [time, props.showAlert])

    return (
        <div 
        className="alert-wrapper"
        style={props.showAlert ? {top: "110px", opacity: '1'} : {top: "-150px", opacity: '0.5'}}
        >
            <div className="completed-circle">
                <BsCheck2 />
            </div>
            <div className="alert-title">{ props.alertTitle }</div>
            <div className="alert-subtitle">{ props.alertSubtitle }</div>
        </div>
    )
}

export default Alert;