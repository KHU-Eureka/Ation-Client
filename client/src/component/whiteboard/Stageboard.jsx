import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Layer, Stage } from 'react-konva';

import Pen from './Pen';
import Shape from './Shape';
import Letter from './Letter';

function Stageboard() {
    const mode = useSelector((state)=> state.mode);
    const detailMode = useSelector((state)=> state.detail_mode);

    const [boardObjectList, setBoardObjectList] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);

    const mouseDownHandler = (e) => {
        setIsDrawing(true);
        if(mode === 'pen') {
            const pos = e.target.getStage().getPointerPosition();
            if(detailMode === 'pen') {
                setBoardObjectList([...boardObjectList, { type: 'pen', detailType: 'pen', points: [pos.x, pos.y] }]);
            } else if(detailMode === 'highlighter') {
                setBoardObjectList([...boardObjectList, { type: 'pen', detailType: 'highlighter', points: [pos.x, pos.y] }]);
            } else if(detailMode === 'eraser') {
                setBoardObjectList([...boardObjectList, { type: 'pen', detailType: 'eraser', points: [pos.x, pos.y] }]);
            }
        } else if(mode === 'shape') {
            const pos = e.target.getStage().getPointerPosition();
            if(detailMode === 'rect') {
                setBoardObjectList([...boardObjectList, { type: 'shape', detailType: 'rect', points: [pos.x, pos.y, 0, 0] }]);
            } else if(detailMode === 'tri') {
                setBoardObjectList([...boardObjectList, { type: 'shape', detailType: 'tri', points: [pos.x, pos.y, 0, 0] }]);
            } else if(detailMode === 'circle') {
                setBoardObjectList([...boardObjectList, { type: 'shape', detailType: 'circle', points: [pos.x, pos.y, 0] }]);
            } else if(detailMode === 'line') {
                setBoardObjectList([...boardObjectList, { type: 'shape', detailType: 'line', points: [pos.x, pos.y, 0, 0] }]);
            }
        } else if(mode === 'text') {
            const pos = e.target.getStage().getPointerPosition();
            setBoardObjectList([...boardObjectList, { type: 'text', detailType: null, points: [pos.x, pos.y], content: '' }]);
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
            } else if(mode === 'text') {
                // lastObj.points[0] = pos.x - lastObj.points[0];
                // lastObj.points[1] = pos.y - lastObj.points[1];
            }
            boardObjectList.splice(boardObjectList.length - 1, 1, lastObj);
            setBoardObjectList(boardObjectList.concat());
        }
    }

    const mouseUpHandler = () => {
        setIsDrawing(false);
    }

    return (
        <Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={mouseDownHandler} onMouseMove={mouseMoveHandler} onMouseUp={mouseUpHandler}>
            <Layer>
                {boardObjectList.map( (obj, i) => obj.type === 'pen'?
                    <Pen penObj={obj}/>
                :obj.type === 'shape'?
                    <Shape shapeObj={obj}/>
                :obj.type === 'text'?
                    <Letter textObj={obj}/>
                :<></>)}
            </Layer>
        </Stage>
    );
}

export default Stageboard;