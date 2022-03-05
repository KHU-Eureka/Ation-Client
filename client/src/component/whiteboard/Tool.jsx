import React, { useRef } from 'react';
import { useDispatch  } from 'react-redux';

import Persona from '../pin/Persona';
import Pin from '../pin/Pin';

import '../../assets/css/whiteboard/Tool.scss';
import tool_choice from '../../assets/svg/tool_choice.svg';
import tool_pen from '../../assets/svg/tool_pen.svg';
import tool_shape from '../../assets/svg/tool_shape.svg';
import tool_text from '../../assets/svg/tool_text.svg';
import tool_postit from '../../assets/svg/tool_postit.svg';
import tool_image from '../../assets/svg/tool_image.svg';
import tool_pin from '../../assets/svg/tool_pin.svg';

function Tool(props) {
    const { setText, setImgSrc, setPinObject } = props;

    const dispatch = useDispatch();

    const penContainer = useRef();
    const shapeContainer = useRef();
    const postitContainer = useRef();
    const pinContainer = useRef();

    const toolClickHandler = ({ target }) => {
        //mode 관련...
        if(target.className === 'Pen') {
            dispatch({type: 'MODE', data: 'pen'});
            penContainer.current.style.display = 'inline';
        } else if(target.className === 'Shape') {
            dispatch({type: 'MODE', data: 'shape'});
            shapeContainer.current.style.display = 'inline';
        } else if(target.className === 'Text') {
            dispatch({type: 'MODE', data: 'text'});
            setText('');
        } else if(target.className === 'Postit') {
            dispatch({type: 'MODE', data: 'postit'});
            postitContainer.current.style.display = 'inline';
        } else if(target.className === 'Image') {
            dispatch({type: 'MODE', data: 'image'});
        } else if(target.className === 'Pin') {
            dispatch({type: 'MODE', data: 'pin'});
            pinContainer.current.style.display = 'inline';
        } else if(target.className === 'Choice') {
            dispatch({type: 'MODE', data: 'choice'});
        }
        //...mode 관련

        //detail mode 관련...
        if(penContainer.current.contains(target)) {
            if(target.className === 'pen') {
                dispatch({type: 'DETAIL_MODE', data: 'pen'});
            } else if(target.className === 'highlighter') {
                dispatch({type: 'DETAIL_MODE', data: 'highlighter'});
            } else if(target.className === 'eraser') {
                dispatch({type: 'DETAIL_MODE', data: 'eraser'});
            }
        } else if(shapeContainer.current.contains(target)) {
            if(target.className === 'rect') {
                dispatch({type: 'DETAIL_MODE', data: 'rect'});
            } else if(target.className === 'tri') {
                dispatch({type: 'DETAIL_MODE', data: 'tri'});
            } else if(target.className === 'circle') {
                dispatch({type: 'DETAIL_MODE', data: 'circle'});
            } else if(target.className === 'line') {
                dispatch({type: 'DETAIL_MODE', data: 'line'});
            }
        }
        //...detail mode 관련
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
            <div className='Choice'><img className='Choice' src={tool_choice} /></div>
            <div className='Pen'><img className='Pen' src={tool_pen} /></div>
            <div className='pen-container' style={{display: 'none'}} ref={penContainer}>
                <p className='pen'>펜</p>
                <p className='highlighter'>형광펜</p>
                <p className='eraser'>지우개</p>
            </div>
            <div className='Shape'><img className='Shape' src={tool_shape} /></div>
            <div className='shape-container' style={{display: 'none'}} ref={shapeContainer}>
                <p className='rect'>사각형</p>
                {/* <p className='soft-rect'>부드러운 사각형</p> */}
                {/* <p className='tri'>삼각형</p> */}
                <p className='circle'>원</p>
                {/* <p className='arrow'>화살표</p> */}
                {/* <p className='line'>선</p> */}
            </div>
            <div className='Postit'><img className='Postit' src={tool_postit} /></div>
            <div className='postit-container' style={{display: 'none'}} ref={postitContainer}>
                <p>색</p>
            </div>
            <div className='Text'><img className='Text' src={tool_text} /></div>
            <label className="Image" htmlFor="input-file">
                <img className='Image' src={tool_image} />
            </label>
            <input type='file' className='Image' id="input-file" style={{display:"none"}} onChange={readImage}/>
            <div className='Pin'><img className='Pin' src={tool_pin} /></div>
            <div className='pin-container' style={{display: 'none'}} ref={pinContainer}>
                <Persona />
                <Pin setPinObject={setPinObject} />
            </div>
        </div>
        
        </>
    );
}

export default Tool;