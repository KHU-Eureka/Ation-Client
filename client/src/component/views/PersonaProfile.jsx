import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import OpenLounge from '../open_lounge/OpenLounge';
import { useFetch, clickUIChangeHandler, clickUIPrevHandler } from '../state';
import { BTN_CLICKSTYLE, BTN_CLICKOUTSTYLE } from '../lounge/atomStyleSheet';

import '../../assets/css/PersonaProfile.css';

import eye from '../../assets/svg/sense_eye_o.svg';
import nose from '../../assets/svg/sense_nose_o.svg';
import mouth from '../../assets/svg/sense_mouth_o.svg';
import ear from '../../assets/svg/sense_ear_o.svg';
import hand from '../../assets/svg/sense_hand_o.svg';

export default function PersonaProfile(props) {
    const { isLoungeHome } = props;
    const activePersonaId = useSelector((state) => state.activePersonaId);
    const personaInfo = useFetch(`${process.env.REACT_APP_SERVER_HOST}/api/persona/${activePersonaId}`, activePersonaId);
    let [showOpenLounge, setShowOpenLounge] = useState(false);
    const senseInfoList = [
        { id: 1, name: "눈", svg: eye },
        { id: 2, name: "코", svg: nose },
        { id: 3, name: "입", svg: mouth },
        { id: 4, name: "귀", svg: ear },
        { id: 5, name: "손", svg: hand },
      ]

    const titleStyle = {
        fontFamily: 'Pretendard',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '18px',
        color: '#352C23'
    };

    const nameStyle = {
        fontFamily: 'Pretendard',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '21px',
        color: '#352C23',
    };

    const columnStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContens: 'space-between',
        width: '119.83px',
        height: '51.38px',
    }

    const loungeOpenClickHandler = ({ target }) => {
        //clickUIChangeHandler(BTN_CLICKSTYLE, target);
        setShowOpenLounge(true);
        //const btnDoc = document.querySelectorAll('.btn');
        //clickUIPrevHandler(BTN_CLICKOUTSTYLE, btnDoc);
    }
  

    return (
        <>
        { showOpenLounge && <OpenLounge setShowOpenLounge={setShowOpenLounge}/> }
        <div className='PersonaProfile-Container' style={{width: '250px', height: isLoungeHome?'149px':'88.38px'}}>
            <div className="title" style={{...titleStyle}}>활동 중인 페르소나</div>
                {/* <div className="content-wrapper" width='181.83px' height='51.38px' style={{}}> */}
                {
                    personaInfo &&
                    <div className="active-persona row" style={{width:'181.83px', height:'51.38px', display: 'flex'}}>
                        <img src={personaInfo.profileImgPath} alt="profile" style={{width: '50px', height: '50px', borderRadius: '10px', marginRight: '12px', objectFit: 'cover'}}/>
                        <div className="column grow" style={columnStyle}>
                            <div className="nickname" style={nameStyle}>{personaInfo.nickname}</div>
                            <div className="sense-wrapper">
                                { personaInfo.senseIdList && personaInfo.senseIdList.map((sense, idx) => (
                                    <img 
                                    className="sense-elem"    
                                    src={senseInfoList.find(elem=>elem.id===sense).svg}
                                    alt="sense" 
                                    style={sense===4?{width: '10px', height: '20px',}:sense===5?{width: '20px', height: '15px'}:null}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                }
                {/* </div> */}
                {isLoungeHome?
                <div className='btn-container'>
                    <button className='btn' id={showOpenLounge && 'click-style'} 
                    onClick={loungeOpenClickHandler}>Open Lounge</button>
                </div>
                :null}
        </div>
        </>
    );
}