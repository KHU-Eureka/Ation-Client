import React, { useEffect, useRef, useContext } from 'react';
import { useDispatch  } from 'react-redux';

import Persona from '../pin/Persona';
import Pin from '../pin/Pin';
import Color from './Color';

import { AttrContextStore } from './store/AttrContext';
import { clickUIPrevHandler, clickUIChangeHandler } from '../state';

import '../../assets/css/whiteboard/Tool.scss';
import tool_choice from '../../assets/svg/tool_choice.svg';
import tool_pen from '../../assets/svg/tool_pen.svg';
import tool_shape from '../../assets/svg/tool_shape.svg';
import tool_text from '../../assets/svg/tool_text.svg';
import tool_postit from '../../assets/svg/tool_postit.svg';
import tool_image from '../../assets/svg/tool_image.svg';
import tool_pin from '../../assets/svg/tool_pin.svg';
import pen from "../../assets/svg/detailTool/pen.svg";
import highlight from "../../assets/svg/detailTool/highlight.svg";
import eraser from "../../assets/svg/detailTool/eraser.svg";
import penColor from "../../assets/svg/detailTool/penColor.svg";
import penWidth from "../../assets/svg/detailTool/penWidth.svg";
import rect from "../../assets/svg/detailTool/rect.svg";
import circle from "../../assets/svg/detailTool/circle.svg";
import tri from "../../assets/svg/detailTool/tri.svg";
import arrow from "../../assets/svg/detailTool/arrow.svg";
import line from "../../assets/svg/detailTool/line.svg";
import roundRect from "../../assets/svg/detailTool/roundRect.svg";
import shapeLine from "../../assets/svg/detailTool/shapeLine.svg";
import shapeColor from "../../assets/svg/detailTool/shapeColor.svg";

function Tool(props) {
    const { setText, setImgSrc, setPinObject } = props;

    const attrStore = useContext(AttrContextStore);
    const dispatch = useDispatch();

    const penRef = useRef();
    const shapeRef = useRef();
    const textRef = useRef();
    const postitRef = useRef();
    const imgRef = useRef();
    const pinRef = useRef();
    const choiceRef = useRef();

    const penContainer = useRef();
    const shapeContainer = useRef();
    const postitContainer = useRef();
    const pinContainer = useRef();

    const d_pen = useRef();
    const d_highlight = useRef();
    const d_eraser = useRef();
    const d_penColor = useRef();
    const d_penWidth = useRef();

    const d_rect = useRef();
    const d_circle = useRef();
    const d_tri = useRef();
    const d_shapeColor = useRef();
    const d_shapeWidth = useRef();

    const penColorRef = useRef();
    const penWidthRef = useRef();
    const shapeColorRef = useRef();
    const shapeWidthRef = useRef();
    const postitColorRef = useRef();

    const detailToolStyle_prev = {
        display: 'none',
    }
    const detailToolStyle_new = {
        display: 'flex',
    }
    const modeStyle_prev = {
        background: 'none',
    }
    const modeStyle_new = {
        background: '#F24822',
    }
    const imgStyle_prev = {
        filter: 'none',
    }
    const imgStyle_new = {
        filter: 'brightness(500%)',
    }
    const detailStyle_new = {
        background: '#BEBBB9',
    }

    const mainToolOnStyle = (target, boxTarget) => {
        if(boxTarget) {
            clickUIChangeHandler(detailToolStyle_new, boxTarget.current);
        }
        clickUIChangeHandler(modeStyle_new, target.current);
        clickUIChangeHandler(imgStyle_new, target.current.querySelector('img'));
    }

    const attrOffStyle = () => {
        const attrDoc = document.querySelectorAll('.attr-container');
        const attrImgDoc = document.querySelectorAll('.attrImg');
        const attrBoxDoc = document.querySelectorAll('.attr');
        clickUIPrevHandler(modeStyle_prev, attrBoxDoc);
        clickUIPrevHandler(imgStyle_prev, attrImgDoc);
        clickUIPrevHandler(detailToolStyle_prev, attrDoc);
    }

    const mainToolOffStyle = () => {
        const mainDoc = document.querySelectorAll('.main'); //main-tool
        const imgDoc = document.querySelectorAll('.mainToolImg'); //all-tool-btn
        const detailToolDoc = document.querySelectorAll('.detail-container'); //sub-tool-container
        clickUIPrevHandler(detailToolStyle_prev, detailToolDoc);
        clickUIPrevHandler(modeStyle_prev, mainDoc);
        clickUIPrevHandler(imgStyle_prev, imgDoc);
    }

    const subToolOnStyle = (target) => {
        clickUIChangeHandler(detailStyle_new, target.current);
        clickUIChangeHandler(imgStyle_new, target.current.querySelector('img'));
    }
    
    const subToolOffStyle = () => {
        const detailDoc = document.querySelectorAll('.detail');
        const detailImgDoc = document.querySelectorAll('.detailImg');
        clickUIPrevHandler(modeStyle_prev, detailDoc);
        clickUIPrevHandler(imgStyle_prev, detailImgDoc);
    }

    useEffect(() => {
        attrOffStyle();
    }, [attrStore.mode])

    useEffect(() => {
        mainToolOffStyle();
        subToolOffStyle();
        switch(attrStore.mode) {
            case 'pen':
                mainToolOnStyle(penRef, penContainer);
                break;
            case 'shape':
                mainToolOnStyle(shapeRef, shapeContainer);
                break;
            case 'postit':
                mainToolOnStyle(postitRef, postitContainer);
                break;
            case 'text':
                mainToolOnStyle(textRef);
                break;
            case 'image':
                mainToolOnStyle(imgRef);
                break;
            case 'pin':
                mainToolOnStyle(pinRef, pinContainer);
                break;
            default:
                mainToolOnStyle(choiceRef);
                break;
        }
        switch(attrStore.detailMode) {
            case 'pen':
                subToolOnStyle(d_pen);
                break;
            case 'highlight':
                subToolOnStyle(d_highlight);
                break;
            case 'eraser':
                subToolOnStyle(d_eraser);
                break;
            case 'rect':
                subToolOnStyle(d_rect);
                break;
            case 'circle':
                subToolOnStyle(d_circle);
                break;
            case 'tri':
                subToolOnStyle(d_tri);
                break;
            }
    }, [attrStore.mode, attrStore.detailMode])

    const toolClickHandler = ({ target }) => {
        if(target !== document.querySelector('#input-file')) {
            if(target.classList.contains('Pen')) {
                attrStore.setMode('pen');
                attrStore.setDetailMode('pen');
            } else if(target.classList.contains('Shape')) {
                attrStore.setMode('shape');
                attrStore.setDetailMode('rect');
            } else if(target.classList.contains('Postit')) {
                attrStore.setMode('postit');
                attrStore.setDetailMode('');
            } else if(target.classList.contains('Text')) {
                attrStore.setMode('text');
                attrStore.setDetailMode('');
            } else if(target.classList.contains('Pin')) {
                attrStore.setMode('pin');
                attrStore.setDetailMode('');
            } else if(target.classList.contains('Choice')) {
                attrStore.setMode('choice');
                attrStore.setDetailMode('');
            }
        } else {
            attrStore.setMode('image');
            attrStore.setDetailMode('');
        }

        //detail mode 관련...
        if(penContainer.current.contains(target)) {
            if(target.classList.contains('pen')) {
                attrStore.setDetailMode('pen');
            } else if(target.classList.contains('highlighter')) {
                attrStore.setDetailMode('highlight');
            } else if(target.classList.contains('eraser')) {
                attrStore.setDetailMode('eraser');
            } else if(target.classList.contains('penColor')) {
                attrOffStyle();
                clickUIChangeHandler(detailToolStyle_new, penColorRef.current);
                clickUIChangeHandler(detailStyle_new, d_penColor.current);
                clickUIChangeHandler(imgStyle_new, d_penColor.current.querySelector('img'));
            } else if(target.classList.contains('penWidth')) {
                attrOffStyle();
                clickUIChangeHandler(detailStyle_new, d_penWidth.current);
                clickUIChangeHandler(imgStyle_new, d_penWidth.current.querySelector('img'));
            }
        } else if(shapeContainer.current.contains(target)) {
            if(target.classList.contains('rect')) {
                attrStore.setDetailMode('rect');
            } else if(target.classList.contains('circle')) {
                attrStore.setDetailMode('circle');
            } else if(target.classList.contains('tri')) {
                attrStore.setDetailMode('tri');
            } else if(target.classList.contains('shapeColor')) {
                attrOffStyle();
                clickUIChangeHandler(detailToolStyle_new, shapeColorRef.current);
                clickUIChangeHandler(detailStyle_new, d_shapeColor.current);
                clickUIChangeHandler(imgStyle_new, d_shapeColor.current.querySelector('img'));
            } else if(target.classList.contains('shapeWidth')) {
                attrOffStyle();
                clickUIChangeHandler(detailStyle_new, d_shapeWidth.current);
                clickUIChangeHandler(imgStyle_new, d_shapeWidth.current.querySelector('img'));
            }
        }
    }

    const readImage = ({ target }) => {
        const reader = new FileReader();
        reader.readAsDataURL(target.files[0]);
        reader.onload = function({ target }) {
            setImgSrc(target.result);
        }
    }

    return (
        <>
        <div className='Tool-Container' onClick={toolClickHandler}>
            <div className='main mode Choice' ref={choiceRef}><img className='mainToolImg Choice' src={tool_choice} /></div>
            <div className='main mode tool-container Pen' ref={penRef}><img className='mainToolImg Pen' src={tool_pen} /></div>
            <div className='detail-container pen-container' style={{display: 'none'}} ref={penContainer}>
                <div className='pen-wrap-container'>
                    <div className='mode detail pen' ref={d_pen}><img className='detailImg pen' src={pen} /></div>
                    <div className='mode detail highlighter' ref={d_highlight}><img className='detailImg highlighter' src={highlight} /></div>
                    <div className='mode detail eraser' ref={d_eraser}><img className='detailImg eraser' src={eraser} /></div>
                    <div className='mode attr penColor' ref={d_penColor}><img className='attrImg penColor' src={penColor} /></div>
                    <div className='attr-container color-container' id='pen' ref={penColorRef} style={{display: 'none'}}>
                        <Color/>
                    </div>
                    <div className='mode attr penWidth' ref={d_penWidth}><img className='attrImg penWidth' src={penWidth} /></div>
                </div>
            </div>
            <div className='main mode tool-container Shape' ref={shapeRef}><img className='mainToolImg Shape' src={tool_shape} /></div>
            <div className='detail-container shape-container' style={{display: 'none'}} ref={shapeContainer}>
                <div className='shape-wrap-container'>
                    <div className='mode detail rect' ref={d_rect}><img className='detailImg rect' src={rect} /></div>
                    {/* <div className='mode soft-rect'><img className='soft-rect' src={roundRect} /></div> */}
                    <div className='mode detail circle' ref={d_circle}><img className='detailImg circle' src={circle} /></div>
                    <div className='mode detail tri' ref={d_tri}><img className='detailImg tri' src={tri} /></div>
                    {/* <div className='mode arrow'><img className='arrow' src={arrow} /></div> */}
                    {/* <div className='mode line'><img className='line' src={line} /></div> */}
                    <div className='mode line'></div>
                    <div className='mode attr shapeLine' ref={d_shapeWidth}><img className='attrImg shapeWidth' src={shapeLine} /></div>
                    <div className='mode attr shapeColor' ref={d_shapeColor}><img className='attrImg shapeColor' src={shapeColor} /></div>
                    <div className='attr-container color-container' id='shape' ref={shapeColorRef} style={{display: 'none'}}>
                        <Color/>
                    </div>
                </div>
            </div>
            <div className='main mode tool-container Postit' ref={postitRef}><img className='mainToolImg Postit' src={tool_postit} /></div>
           
                <div className='attr-container postit-container color-container' id='postit' style={{display: 'none'}} ref={postitContainer}>
                    <Color/>
                </div>
            
            <div className='main mode Text' ref={textRef}><img className='mainToolImg Text' src={tool_text} /></div>
            <div className='main mode Image' ref={imgRef}>
                <label className="Image" htmlFor="input-file">
                    <img className='mainToolImg Image' src={tool_image} />
                </label>
                <input type='file' id="input-file" style={{display:"none"}} onChange={readImage}/>
            </div>
            <div className='main mode tool-container Pin' ref={pinRef}><img className='mainToolImg Pin' src={tool_pin} /></div>
            <div className='detail-container pin-container' style={{display: 'none'}} ref={pinContainer}>
                <div className='pin-wrap-container'>
                    <Persona />
                    <Pin setPinObject={setPinObject} />
                </div>
            </div>
        </div>

        </>
    );
}

export default Tool;




















//////////////////////////////////////////////////////////////////////////////


//mode 관련...
        // if(target.className === 'Pen') {
        //     dispatch({type: 'MODE', data: 'pen'});
        //     clickUIPrevHandler(detailToolStyle_prev, detailToolDoc);
        //     clickUIChangeHandler(detailToolStyle_new, penContainer.current);
        // } else if(target.className === 'Shape') {
        //     dispatch({type: 'MODE', data: 'shape'});
        //     clickUIPrevHandler(detailToolStyle_prev, detailToolDoc);
        //     clickUIChangeHandler(detailToolStyle_new, shapeContainer.current);
        // } else if(target.className === 'Text') {
        //     dispatch({type: 'MODE', data: 'text'});
        //     setText('');
        //     clickUIPrevHandler(detailToolStyle_prev, detailToolDoc);
        // } else if(target.className === 'Postit') {
        //     dispatch({type: 'MODE', data: 'postit'});
        //     clickUIPrevHandler(detailToolStyle_prev, detailToolDoc);
        //     clickUIChangeHandler(detailToolStyle_new, postitContainer.current);
        // } else if(target.className === 'Image') {
        //     dispatch({type: 'MODE', data: 'image'});
        //     clickUIPrevHandler(detailToolStyle_prev, detailToolDoc);
        // } else if(target.className === 'Pin') {
        //     dispatch({type: 'MODE', data: 'pin'});
        //     pinContainer.current.style.display = 'inline';
        //     clickUIPrevHandler(detailToolStyle_prev, detailToolDoc);
        // } else if(target.className === 'Choice') {
        //     dispatch({type: 'MODE', data: 'choice'});
        //     clickUIPrevHandler(detailToolStyle_prev, detailToolDoc);
        // }
        //...mode 관련

        // switch(target.className) {
        //     case 'Pen':
        //         attrStore.setMode('pen');
        //         attrStore.setDetailMode('pen');
        //         // dispatch({type: 'MODE', data: 'pen'});
        //         // clickUIChangeHandler(detailToolStyle_new, penContainer.current);
        //         // clickUIChangeHandler(imgStyle_new, target);
        //         // clickUIChangeHandler(modeStyle_new, penRef.current);
        //         break;
        //     case 'Shape':
        //         attrStore.setMode('shape');
        //         attrStore.setDetailMode('rect');
        //         // clickUIChangeHandler(detailToolStyle_new, shapeContainer.current);
        //         // clickUIChangeHandler(imgStyle_new, target);
        //         // clickUIChangeHandler(modeStyle_new, shapeRef.current);
        //         break;
        //     case 'Text':
        //         attrStore.setMode('text');
        //         attrStore.setDetailMode('');
        //         // clickUIChangeHandler(imgStyle_new, target);
        //         // clickUIChangeHandler(modeStyle_new, textRef.current);
        //         setText('');
        //         break;
        //     case 'Postit':
        //         attrStore.setMode('postit');
        //         attrStore.setDetailMode('');
        //         // clickUIChangeHandler(detailToolStyle_new, postitContainer.current);
        //         // clickUIChangeHandler(imgStyle_new, target);
        //         // clickUIChangeHandler(modeStyle_new, postitRef.current);
        //         break;
        //     case 'Image':
        //         attrStore.setMode('image');
        //         attrStore.setDetailMode('');
        //         // clickUIChangeHandler(imgStyle_new, target);
        //         // clickUIChangeHandler(modeStyle_new, imgRef.current);
        //         break;
        //     case 'Pin':
        //         attrStore.setMode('pin');
        //         attrStore.setDetailMode('');
        //         // clickUIChangeHandler(detailToolStyle_new, pinContainer.current);
        //         // clickUIChangeHandler(imgStyle_new, target);
        //         // clickUIChangeHandler(modeStyle_new, pinRef.current);
        //         break;
        //     case 'Choice':
        //         attrStore.setMode('choice');
        //         attrStore.setDetailMode('');
        //         // clickUIChangeHandler(imgStyle_new, target);
        //         // clickUIChangeHandler(modeStyle_new, choiceRef.current);
        //         break;
        //}