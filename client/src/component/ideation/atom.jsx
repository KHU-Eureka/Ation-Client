import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { AttrContextStore } from './store/AttrContext';
import { MAIN_TITLE, IMAGE, TITLE, DATE, IDEATION_TITLE } from "./atomStyle";
import { deleteBtn } from '../lounge/atoms';
import { MODULE_HOVEROUTSTYLE, MODULE_HOVERSTYLE } from '../lounge/atomStyleSheet';
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
    const navigate = new useNavigate();
    const { obj, setDeleteIdeation } = props;
    const { state } = useLocation();

    const prev_style = {
        background: 'transparent',
        boxShadow: 'none',
    };

    const click_style = {
        background: '#F5F5F5',
        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.07)',
    };

    // useEffect(() => {
    //     if(document.querySelector('.moduleBox-container')) {
    //         const modulebox = document.querySelectorAll('.moduleBox-container');
    //         clickUIPrevHandler(prev_style, modulebox);
    //         for(let mod of modulebox) {
    //             if(mod.getAttribute('id') === state.ideationId) {
    //                 clickUIChangeHandler(click_style, mod);
    //                 break;
    //             }
    //     }
    // }
    // }, [state.ideationId])

    const ideationClickHandler = (e) => {
        const currentId = e.currentTarget.getAttribute('id');
        if(e.target.className !== 'delete-btn') {
            navigate('/whiteboard', {state: {ideationId: currentId}})
        } else if(e.target.className === 'delete-btn' && currentId === state.ideationId) {
            const moduleDoc = document.querySelectorAll('.moduleBox-container');
            let nextModule = null;
            for(let mod of moduleDoc) {
                if(mod.getAttribute('id') > currentId) {
                    nextModule = mod.getAttribute('id');
                    navigate('/whiteboard', {state: {ideationId: nextModule}});
                    return;
                }
            }
            nextModule === null && navigate('/whiteboard', {state: {ideationId: moduleDoc[0].getAttribute('id')}});
        }
    }

    const hoverStyleHandler = ({ currentTarget }) => {
        currentTarget.querySelector('.delete-btn').style.display = 'inline';
        clickUIChangeHandler(MODULE_HOVERSTYLE, currentTarget);
    }

    const hoverOutStyleHandler = ({ currentTarget }) => {
        currentTarget.querySelector('.delete-btn').style.display = 'none';
        clickUIPrevHandler(MODULE_HOVEROUTSTYLE, [currentTarget]);
    }

    return(
        <div id={obj.id} className="moduleBox-container" onClick={ideationClickHandler} onMouseOver={hoverStyleHandler} onMouseOut={hoverOutStyleHandler} style={String(obj.id) === state.ideationId?click_style:prev_style}>
            <div id={obj.id} className="moduleBox-wrap-container">
                <div id={obj.id} className="left-container">
                    <img id={obj.id} src={obj.imgPath} style={IMAGE}/>
                </div>
                <div id={obj.id} className="middle-container">
                    <span id={obj.id} style={TITLE}>{obj.title}</span>
                    <span id={obj.id} style={DATE}>{`${obj.createdAt.substr(5, 2)}월 ${obj.createdAt.substr(8, 2)}일`}</span>
                </div>
            </div>
            {deleteBtn('ideation', obj.id, setDeleteIdeation)}
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