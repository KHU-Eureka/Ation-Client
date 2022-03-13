import { LoungePinup, enterLounge } from '../state';

import { HEADER_STYLE, MAINTITLE_STYLE, MEMBERNUM_STYLE, LEADERNAME_STYLE, LEADERIMG_STYLE, VALIDBTN_STYLE_ENTER, INVALIDBTN_STYLE_ENTER } from './atomStyleSheet';

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
import lounge_delete from '../../assets/svg/lounge_delete.svg';

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

export const title = (title) => {
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

const enterBtn = (isValid, loungeId, personaId) => {
    return(
        <button onClick={ isValid? () => {enterLounge(loungeId, personaId);}:null } style={ isValid? VALIDBTN_STYLE_ENTER:INVALIDBTN_STYLE_ENTER }>입장</button>
    );
}

const deleteBtn = (loungeId) => {
    return(
        <img className="delete-btn" id={loungeId} src={lounge_delete} />
    );
}

export const imgBox = (obj, isPin) => {
    return(
        <div className='imgbox-container' style={{backgroundImage: `url(${obj.imgPath})`, cursor: 'pointer'}} onClick={ ({target}) => enterLounge(target, obj.id, obj.persona.id) }>
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
                <LoungePinup loungeId={obj.id} />
            :null}
        </div>
    );
}

export const moduleBox = (obj, isSense) => {
    return(
        <div className='modulebox-container'>
            <div className='modulebox-wrap-container'>
                {isSense?
                <div className='left-container'>
                    {senseImg(obj.sense.name, 2)}
                </div>
                :null}
                <div className='middle-container'>
                    {title(obj.title)}
                    {tag(obj.mainCategory.name, obj.subCategoryList)}
                </div>
                <div className='right-container'>
                    {enterBtn( obj.status !=='END'? true:false, obj.id, obj.persona.id )}
                </div>
            </div>
            {!isSense?deleteBtn(obj.id):null}
        </div>
    );
}