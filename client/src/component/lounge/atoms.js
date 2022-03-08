import { loungePinup } from '../state';

import { HEADER_STYLE, MAINTITLE_STYLE, MEMBERNUM_STYLE, LEADERNAME_STYLE, LEADERIMG_STYLE, VALIDBTN_STYLE_ENTER } from './atomStyleSheet';

import w_eye from '../../assets/svg/sense_eye.svg';
import w_nose from '../../assets/svg/sense_nose.svg';
import w_ear from '../../assets/svg/sense_ear.svg';
import w_mouth from '../../assets/svg/sense_mouth.svg';
import w_hand from '../../assets/svg/sense_hand.svg';
import o_eye from '../../assets/svg/sense_eye_o.svg';
import o_nose from '../../assets/svg/sense_nose_o.svg';
import o_ear from '../../assets/svg/sense_ear_o.svg';
import o_mouth from '../../assets/svg/sense_mouth_o.svg';
import o_hand from '../../assets/svg/sense_hand_o.svg';

import pin from '../../assets/svg/pin.svg';

const senseImg = (sense, mode) => {
    switch(sense) {
        case '눈':
            return(
                <img className='senseImg' src={mode===1?w_eye:o_eye}/>
            );
        case '코':
            return(
                <img className='senseImg' src={mode===1?w_nose:o_nose}/>
            );
        case '입':
            return(
                <img className='senseImg' src={mode===1?w_ear:o_ear}/>
            );
        case '손':
            return(
                <img className='senseImg' src={mode===1?w_mouth:o_mouth}/>
            );
        case '귀':
            return(
                <img className='senseImg' src={mode===1?w_hand:o_hand}/>
            );
    }
    return(null);
}

const title = (title) => {
    return(
        <span className='title'>
            {title}
        </span>
    );
}

const member = (memberNum, limitNum) => {
    return(
        <span style={MEMBERNUM_STYLE}>
            {memberNum!==null?`${memberNum}/${limitNum}`:`0/${limitNum}`}
        </span>
    );
}

const tag = (mainCategory, subCategoryList) => {
    return(
        <div className='tag-container'>
            <span className='tag'>
                {`#${mainCategory}`}
            </span>
            {subCategoryList.map( tag => 
            <span className='tag'>{`#${tag.name}`}</span>    
            )}
        </div>
    );
}

const leader = (personaName, profileImg) => {
    return(
        <div className='leader-container'>
            <span style={LEADERNAME_STYLE}>{personaName}</span>
            <img src={profileImg} style={LEADERIMG_STYLE}/>
        </div>
    );
}

export const mainTitle = (title, header) => {
    return(
        <header className="title-container" style={{marginLeft: '0px', marginBottom: '20px'}}>
            {header?<span style={HEADER_STYLE}>{header}</span>:null}
            <span style={MAINTITLE_STYLE}>{title}</span>
        </header>
    );
}

const enterBtn = (isValid) => {
    console.log(isValid)
    return(
        <button style={ isValid? VALIDBTN_STYLE_ENTER:null }>입장</button>
    );
}

export const imgBox = (obj, isPin) => {
    return(
        <div className='imgbox-container' style={{backgroundImage: `url(${obj.imgPath})`}}>
            <div className='imgbox-wrap-container'>
                <div className='header-container'>
                    {senseImg(obj.sense.name, 1)}
                </div>
                <div className='main-container'>
                    {title(obj.title)}
                    {member(obj.totalMember, obj.limitMember)}
                </div>
                <div className='footer-container'>
                    {tag(obj.mainCategory.name, obj.subCategoryList)}
                    {leader(obj.persona.nickname, obj.persona.profileImgPath)}
                </div>
            </div>
            {isPin?
                <img className='pin' src={pin} onClick={ () => loungePinup(obj.id) }/>
            :<></>}
        </div>
    );
}

export const moduleBox = (obj) => {
    return(
        <div className='modulebox-container'>
            <div className='modulebox-wrap-container'>
                <div className='left-container'>
                    {senseImg(obj.sense.name, 2)}
                </div>
                <div className='middle-container'>
                    {title(obj.title)}
                    {tag(obj.mainCategory.name, obj.subCategoryList)}
                </div>
                <div className='right-container'>
                    {enterBtn( obj.status==='START'? true:false )}
                </div>
            </div>
        </div>
    );
}