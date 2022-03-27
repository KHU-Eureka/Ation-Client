import React, { useEffect, useRef } from 'react';
import { Line, Transformer } from 'react-konva';

function Pen(props) {
    const { penObj, isSelected, onSelect, onChange, setIsEditing, mode, detailMode } = props;
    const penRef = useRef();
    const transRef = useRef();

    useEffect(() => {
        console.log(isSelected)
        if (mode === 'choice' && isSelected) {
            transRef.current.nodes([penRef.current]);
            transRef.current.getLayer().batchDraw();
        }
      }, [isSelected]);

    const positionEditHandler = (e) => {
        const node = penRef.current
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        let newPoints = penObj.property.points.map( (p, i) => i%2===0 ? p + scaleX : p + scaleY );
        onChange(
            {
                ...penObj.property,
                points: newPoints,
                x: e.target.x(),
                y: e.target.y(), 
            }
        );
    }

    const transformHandler = (e) => {
        const node = penRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        let newPoints = penObj.property.points.map( (p, i) => i%2===0 ?  p * scaleX : p * scaleY );
        onChange(
            {
                ...penObj.property,
                points: newPoints,
                x: node.x(),
                y: node.y(),
            }
        );
    }

    const boundBoxFunc = (oldBox, newBox) => {
        if (newBox.width < 5 || newBox.height < 5) {
            return oldBox;
        }
        return newBox;
    }

    return (
        <>
        <Line
            id={penObj.id}
            ref={penRef}
            {...penObj.property}
            globalCompositeOperation={
                penObj.detailType === 'eraser' ? 'destination-out' : 'source-over'
            }
            onClick={() => {
                if( mode === 'choice') {
                    onSelect();
                    // setIsEditing(true);
                }
            }}
            draggable={ mode === 'choice'? true : false}
            onDragEnd={positionEditHandler}  
            onTransformEnd={transformHandler}
        />
        { mode === 'choice' && isSelected &&
        <Transformer ref={transRef} boundBoxFunc={boundBoxFunc} />
        }
        </>
    );
}

export default Pen;

// points={penObj.property.points}
//             stroke="#df4b26"
//             strokeWidth={5}
//             tension={0.5}
//             lineCap="round"
//             width={penObj.property.width}
//             height={penObj.property.height}