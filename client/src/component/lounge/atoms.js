import { LoungePinup, enterLounge, clickUIPrevHandler, clickUIChangeHandler, deleteHandler } from '../state';

import { HEADER_STYLE, MAINTITLE_STYLE, MEMBERNUM_STYLE, LEADERNAME_STYLE, LEADERIMG_STYLE, VALIDBTN_STYLE_ENTER, INVALIDBTN_STYLE_ENTER, BTN_HOVERSTYLE, BTN_HOVEROUTSTYLE, BTN_CLICKSTYLE, BTN_CLICKOUTSTYLE, MODULE_HOVEROUTSTYLE, MODULE_HOVERSTYLE } from './atomStyleSheet';

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
    const btnDoc = document.querySelectorAll('.btn');

    const hoverStyleHandler = ({ target }) => {
        isValid && clickUIChangeHandler(BTN_HOVERSTYLE, target);
    }

    const hoverOutStyleHandler = ({ target }) => {
        isValid && clickUIChangeHandler(BTN_HOVEROUTSTYLE, target);
    }

    const clickStyleHandler = ({ target }) => {
        if(isValid) {
            clickUIPrevHandler(BTN_CLICKOUTSTYLE, btnDoc);
            clickUIChangeHandler(BTN_CLICKSTYLE, target);
            enterLounge(loungeId, personaId);
        }
    }

    return(
        <button className={isValid?'valid btn':'invalid'} onClick={ isValid?clickStyleHandler:null } style={ isValid? VALIDBTN_STYLE_ENTER:INVALIDBTN_STYLE_ENTER } onMouseOver={hoverStyleHandler} onMouseOut={hoverOutStyleHandler}>입장</button>
    );
}

export const deleteBtn = (url, id, setDeleteLounge) => {
    return(
        <img className="delete-btn" id={id} src={lounge_delete} style={{display: 'none', cursor: 'pointer'}} onClick={() => deleteHandler(url,id).then((data) => setDeleteLounge(data.data))}/>
    );
}

export const imgBox = (obj, isPin) => {
    return(
        <div className='imgbox-container' style={{position: 'relative', cursor: 'pointer', background: 'transparent'}} onClick={ ({target}) => enterLounge(target, obj.id, obj.persona.id) }>
            <img className='imgbox-container' src={obj.imgPath} style={{position: 'absolute', zIndex: '-1', top: '0px'}} loading='lazy' alt="..."/>
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
//backgroundImage: `url(${obj.imgPath})`, 
export const Modulebox = ({ obj, isSense, link, setDeleteLounge }) => {
    
    const hoverStyleHandler = ({ currentTarget }) => {
        currentTarget.querySelector('.delete-btn').style.display = 'inline';
        clickUIChangeHandler(MODULE_HOVERSTYLE, currentTarget);
    }

    const hoverOutStyleHandler = ({ currentTarget }) => {
        currentTarget.querySelector('.delete-btn').style.display = 'none';
        clickUIPrevHandler(MODULE_HOVEROUTSTYLE, [currentTarget]);
    }

    return(
        <div className='modulebox-container' onMouseOver={!isSense?hoverStyleHandler:null} onMouseOut={!isSense?hoverOutStyleHandler:null}>
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
            {!isSense?deleteBtn(link, obj.id, setDeleteLounge):null}
        </div>
    );
}

export const defaultText = "라운지 참여 내역이 ";