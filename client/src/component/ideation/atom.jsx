import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { MAIN_TITLE, IMAGE, TITLE, DATE, IDEATION_TITLE } from "./atomStyle";
import { clickUIPrevHandler, clickUIChangeHandler } from "../state";

import title_left from '../../assets/svg/ideation_title1.svg';
import title_right from '../../assets/svg/ideation_title2.svg';

export const mainTitle = (title) => {
    return(
        <div style={MAIN_TITLE}>
            <span>{title}</span>
        </div>
    );
}   

const titleIcon = (elem) => {
    return(
        <div>
            <img src={title_left} />
                {elem}
            <img src={title_right} />
        </div>
    );
}

export const ModuleBox = (props) => {
    const { obj } = props;
    const navigate = new useNavigate();
    const { state } = useLocation();

    const prev_style = {
        background: 'transparent',
        boxShadow: 'none',
    };

    const click_style = {
        background: '#F5F5F5',
        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.07)',
    };

    useEffect(() => {
        if(document.querySelector('.moduleBox-container')) {
            const modulebox = document.querySelectorAll('.moduleBox-container');
            clickUIPrevHandler(prev_style, modulebox);
            for(let mod of modulebox) {
                if(parseInt(mod.getAttribute('id')) === state.ideationId) clickUIChangeHandler(click_style, mod);
                else continue;
            }
        }
    }, [])

    const ideationClickHandler = ({ currentTarget }) => {
        if(document.querySelector('.moduleBox-container')) {
            const modulebox = document.querySelectorAll('.moduleBox-container');
            clickUIPrevHandler(prev_style, modulebox);
            clickUIChangeHandler(click_style, currentTarget);
        }
        navigate('/whiteboard', {state: {ideationId: currentTarget.getAttribute('id')}})
    }

    return(
        <div id={obj.id} className="moduleBox-container" onClick={ideationClickHandler}>
            <div id={obj.id} className="moduleBox-wrap-container">
                <div id={obj.id} className="left-container">
                    <img id={obj.id} src={obj.imgPath} style={IMAGE}/>
                </div>
                <div id={obj.id} className="middle-container">
                    <span id={obj.id} style={TITLE}>{obj.title}</span>
                    <span id={obj.id} style={DATE}>{`${obj.createdAt.substr(5, 2)}월 ${obj.createdAt.substr(8, 2)}일`}</span>
                </div>
            </div>
        </div>
    );
}

export const ideationTitle = (title) => {
    return(
        <div className="ideationTitle-container">
            {titleIcon(<span style={IDEATION_TITLE}>{title}</span>)}
        </div>
    );
}

// export const InputTitle = (props) => {
//     const { state } = useLocation();
//     const [title, setTitle] = useState("");
    

//     const titleChangeHandler = ({ target }) => {
//         setTitle(target.value);
//     }

//     useEffect(() => {
//         if(props.ChangeTitle) {
//             console.log(props)
//             ideationTitlePost(state.ideationId, title).then((data) => {props.setChangeTitle(data.data);props.setChangeTitle(false);props.setOpenOptionTitle(false);});
//         }
//     }, [props.ChangeTitle, title])

//     return(
//         <div>
//             <input className="inputTitle" value={title} onChange={titleChangeHandler} placeholder='제목을 입력해 주세요.'/>
//         </div>
//     );
//}