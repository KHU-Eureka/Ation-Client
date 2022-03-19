import React, { useEffect, useRef } from 'react';
import { Rect, Circle, Line, Transformer } from 'react-konva';


function Shape(props) {
    const { shapeObj, isSelected, onSelect, onChange, setIsEditing, mode } = props;
    const shapeRef = useRef();
    const transRef = useRef();

    useEffect(() => {
        if (mode === 'choice' && isSelected) {
            transRef.current.nodes([shapeRef.current]);
            transRef.current.getLayer().batchDraw();
        }
      }, [isSelected]);

    const positionEditHandler = (e) => {
        onChange(
            {
                ...shapeObj.property,
                x: e.target.x(),
                y: e.target.y(),
            }
        );
    }

    const transformHandler = (e) => {
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          ...shapeObj.property,
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(node.height() * scaleY),
        });
    }

    const transformCircleHandler = (e) => {
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          ...shapeObj.property,
          x: node.x(),
          y: node.y(),
          radius: Math.max(2.5, node.radius() * scaleX),
        });
    }

    const boundBoxFunc = (oldBox, newBox) => {
        if (newBox.width < 5 || newBox.height < 5) {
            return oldBox;
        }
        return newBox;
    }

    return (
        <>
        {shapeObj.detailType === 'rect'?
            <Rect
                ref={shapeRef}
                {...shapeObj.property}
                onClick={() => {
                    mode === 'choice' &&
                    onSelect();
                    setIsEditing(true);
                }}
                draggable={mode === 'choice' ? true:false}
                onDragEnd={positionEditHandler}
                onTransformEnd={transformHandler}
            />
        :shapeObj.detailType === 'circle'?
            <Circle 
                ref={shapeRef}
                {...shapeObj.property}
                onClick={() => {
                    mode === 'choice' &&
                    onSelect();
                    setIsEditing(true);
                }}
                draggable={mode === 'choice' ? true:false}
                onDragEnd={positionEditHandler}
                onTransformEnd={transformCircleHandler}
            />
        :<></>}
        {mode === 'choice' && isSelected && 
        <Transformer 
            ref={transRef}
            boundBoxFunc={boundBoxFunc}
        />}
        </>
    );
}

export default Shape;