import React, { useEffect, useRef } from 'react';
import { Line, Transformer } from 'react-konva';
import { useSelector } from 'react-redux';


function Pen(props) {
    const { penObj, isSelected, onSelect, onChange, setIsEditing, mode } = props;
    // const mode = useSelector((state)=> state.mode);
    const penRef = useRef();
    const transRef = useRef();

    useEffect(() => {
        if (mode === 'choice' && isSelected) {
            transRef.current.nodes([penRef.current]);
            transRef.current.getLayer().batchDraw();
        }
      }, [isSelected]);

    const positionEditHandler = (e) => {
        const node = penRef.current
        let newPoints = penObj.property.points.map( (p, i) => i%2===0 ? p + node.x() : p + node.y() );
        onChange(
            {
                ...penObj.property,
                points: newPoints
            }
        );
        console.log("qwer")
    }

    const transformHandler = (e) => {
        const node = penRef.current;
        const scaleX = node.scaleX();
        console.log(node.width()* scaleX)
        const scaleY = node.scaleY();
        // let newPoints = penObj.property.points.map( (p, i) => i%2===0 ? p + node.x() : p + node.y() );
        node.scaleX(1);
        node.scaleY(1);
        // onChange(
        //     {
        //         ...penObj.property,
        //         // points: newPoints,
        //         width: Math.max(5, node.width() * scaleX),
        //         height: Math.max(node.height() * scaleY),
        //     }
        // );
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
            ref={penRef}
            {...penObj.property}
            globalCompositeOperation={
                penObj.detailType === 'eraser' ? 'destination-out' : 'source-over'
            }
            onClick={() => {
                if( mode === 'choice') {
                    onSelect();
                    setIsEditing(true);
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