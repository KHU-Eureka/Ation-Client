import React, { useRef } from 'react';
import { useDispatch  } from 'react-redux';

import '../../assets/css/whiteboard/Tool.scss';

function Tool() {
    const dispatch = useDispatch();
    const penContainer = useRef();
    const shapeContainer = useRef();

    const toolClickHandler = ({ target }) => {
        if(target.className === 'Pen') {
            if(document.querySelector('.pen-container')) {
                const penContainer = document.querySelector('.pen-container');
                penContainer.style.display = 'inline';
            }
            dispatch({type: 'MODE', data: 'pen'});
        } else if(target.className === 'Shape') {
            if(document.querySelector('.shape-container')) {
                const penContainer = document.querySelector('.shape-container');
                penContainer.style.display = 'inline';
            }
            dispatch({type: 'MODE', data: 'shape'});
        } else if(target.className === 'Text') {
            dispatch({type: 'MODE', data: 'text'});
        }

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
    }

    return (
        <div className='Tool-Container' onClick={toolClickHandler}>
            <div>선택</div>
            <div className='Pen'>펜</div>
            <div className='pen-container' style={{display: 'none'}} ref={penContainer}>
                <p className='pen'>펜</p>
                <p className='highlighter'>형광펜</p>
                <p className='eraser'>지우개</p>
            </div>
            <div className='Shape'>도형</div>
            <div className='shape-container' style={{display: 'none'}} ref={shapeContainer}>
                <p className='rect'>사각형</p>
                {/* <p className='soft-rect'>부드러운 사각형</p> */}
                <p className='tri'>삼각형</p>
                <p className='circle'>원</p>
                {/* <p className='arrow'>화살표</p> */}
                <p className='line'>선</p>
            </div>
            <div>포스트잇</div>
            <div className='Text'>텍스트</div>
            <div>이미지</div>
            <div>핀</div>
        </div>
    );
}

export default Tool;