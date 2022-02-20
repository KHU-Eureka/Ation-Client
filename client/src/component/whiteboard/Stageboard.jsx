import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Layer, Stage } from 'react-konva';
import useImage from 'use-image';

import Pen from './Pen';
import Shape from './Shape';
import Letter from './Letter';
import Postit from './Postit';
import Image from './Image';
import Pin from './Pin';

function Stageboard(props) {
    const { setText, text, imgSrc, pinObject } = props;

    const mode = useSelector((state)=> state.mode);
    const detailMode = useSelector((state)=> state.detail_mode);

    const [boardObjectList, setBoardObjectList] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);

    const [image] = useImage(imgSrc);

    const mouseDownHandler = (e) => {
        setIsDrawing(true);
        const pos = e.target.getStage().getPointerPosition();
        if(mode === 'pen') {
            if(detailMode === 'pen') {
                setBoardObjectList([...boardObjectList, { type: 'pen', detailType: 'pen', points: [pos.x, pos.y], content: null }]);
            } else if(detailMode === 'highlighter') {
                setBoardObjectList([...boardObjectList, { type: 'pen', detailType: 'highlighter', points: [pos.x, pos.y], content: null }]);
            } else if(detailMode === 'eraser') {
                setBoardObjectList([...boardObjectList, { type: 'pen', detailType: 'eraser', points: [pos.x, pos.y], content: null }]);
            }
        } else if(mode === 'shape') {
            if(detailMode === 'rect') {
                setBoardObjectList([...boardObjectList, { type: 'shape', detailType: 'rect', points: [pos.x, pos.y, 0, 0], content: null }]);
            } else if(detailMode === 'tri') {
                setBoardObjectList([...boardObjectList, { type: 'shape', detailType: 'tri', points: [pos.x, pos.y, 0, 0], content: null }]);
            } else if(detailMode === 'circle') {
                setBoardObjectList([...boardObjectList, { type: 'shape', detailType: 'circle', points: [pos.x, pos.y, 0], content: null }]);
            } else if(detailMode === 'line') {
                setBoardObjectList([...boardObjectList, { type: 'shape', detailType: 'line', points: [pos.x, pos.y, 0, 0], content: null }]);
            }
        } else if(mode === 'text') {
            //textarea 관련 ...
            if(document.querySelector('textarea')) {
                const textareaStyle = document.querySelector('textarea').style;
                if(text === '') {
                    setBoardObjectList([...boardObjectList, { type: 'text', detailType: null, points: [pos.x, pos.y], content: text }]);
                    textareaStyle.display = 'inline';
                    textareaStyle.position = 'absolute';
                    textareaStyle.top = pos.y + 'px';
                    textareaStyle.left = pos.x + 'px';
                } else {
                    let lastObj = boardObjectList[boardObjectList.length - 1];
                    lastObj.content = text;
                    textareaStyle.display = 'none';
                }
            }
            //...textarea 관련
        } else if(mode === 'postit') {
            const textareaStyle = document.querySelector('textarea').style;
            if(text === '') {
                setBoardObjectList([...boardObjectList, { type: 'postit', detailType: null, points: [pos.x, pos.y], content: text }]);
                textareaStyle.display = 'inline';
                textareaStyle.position = 'absolute';
                textareaStyle.top = pos.y + 'px';
                textareaStyle.left = pos.x + 'px';
                // textarea.focus();
            } else {
                let lastObj = boardObjectList[boardObjectList.length - 1];
                lastObj.content = text;
                textareaStyle.display = 'none';
            }
        }
    }

    const mouseMoveHandler = (e) => {
        if(isDrawing) {
            const pos = e.target.getStage().getPointerPosition();
            let lastObj = boardObjectList[boardObjectList.length - 1];
            if(mode === 'pen') {
                lastObj.points = lastObj.points.concat([pos.x, pos.y]);
            } else if(mode === 'shape') {
                if(detailMode === 'rect') {
                    lastObj.points[2] = pos.x - lastObj.points[0];
                    lastObj.points[3] = pos.y - lastObj.points[1];
                } else if(detailMode === 'circle') {
                    if((pos.x - lastObj.points[0]) > 0) {
                        lastObj.points[2] = (pos.x - lastObj.points[0])/2;
                    } else {
                        lastObj.points[2] = (lastObj.points[0] - pos.x)/2;
                    }
                }
            }
            boardObjectList.splice(boardObjectList.length - 1, 1, lastObj);
            setBoardObjectList(boardObjectList.concat());
        }
    }

    const mouseUpHandler = () => {
        setIsDrawing(false);
    }

    const dropHandler = (e) => {
        e.preventDefault();
        console.log(pinObject)
        setBoardObjectList([...boardObjectList, { type: 'pin', detailType: null, points: [e.nativeEvent.offsetX, e.nativeEvent.offsetY], content: pinObject }]);
    }

    const dragOverHandler = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        if(mode === 'image') {
            setBoardObjectList([...boardObjectList, { type: 'image', detailType: null, points: [20, 20], content: image }]);
        }
    }, [image])

    return (
        <div onDrop={dropHandler} onDragOver={dragOverHandler}>
            <Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={mouseDownHandler} onMouseMove={mouseMoveHandler} onMouseUp={mouseUpHandler}>
                <Layer>
                    {boardObjectList.map( (obj, i) => obj.type === 'pen'?
                        <Pen key={i} penObj={obj}/>
                    :obj.type === 'shape'?
                        <Shape key={i} shapeObj={obj}/>
                    :obj.type === 'text'?
                        <Letter key={i} textObj={obj} setText={setText} text={text} />
                    :obj.type === 'postit'?
                        <Postit key={i} postObj={obj} setText={setText} text={text} />
                    :obj.type === 'image'?
                        <Image key={i} imgObj={obj} />
                    :obj.type === 'pin'?
                        <Pin key={i} pinObj={obj} />
                    :<></>)}
                </Layer>
            </Stage>
        </div>
    );
}

export default Stageboard;