import React from "react";
import { useNavigate } from "react-router-dom";

import nonGraphic from '../../assets/svg/no_pin.svg';
import '../../assets/css/NonGraphic.scss';

export default function NonGraphic({ type, isImg, mainText, subContent}) {
    const navigation = useNavigate();

    const loungeLnbStyle = {
        fontWeight: '500',
        fontSize: '16px',
    }
    const loungeMainStyle = {
        fontWeight: '500',
        fontSize: '21px',
    }
    const mainStyle = {
        fontWeight: 'bold',
        fontSize: '38px',
    }
    const mainMargin = (m) => {
        return {marginTop: m}
    }

    const NavigateHandler = () => {
        navigation(`/${subContent.link}`);
    }

    const subTitleStyle = {
        fontFamily: 'Pretendard',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '21px',
        color: '#BEBBB9',
        marginTop: '5px',
    }

    return(
        <div className="nonGraphic-Container">
        {isImg &&
            <div>
                <img className="logo" src={nonGraphic}/>
            </div>
        }
            <div style={type !== 'lounge'?mainMargin('37px'):isImg?mainMargin('22.12px'):null}>
                <span className="description" style={type === 'lounge' && isImg?loungeMainStyle:type !== 'lounge' ? mainStyle:loungeLnbStyle}>{mainText} 없어요!</span> 
            </div>
        {subContent && subContent.type === 'btn'?
            <div style={type === 'lounge'?{marginTop: '10px'}:null}>
                <button className="btn" onClick={NavigateHandler} style={type === 'lounge'?{width: '285px'}:null}>{subContent.content}</button>
            </div>:
        subContent ?
            <div style={subTitleStyle}>
                <span>{subContent.content}</span>
            </div>
        :null
        }
        </div>
    );
}