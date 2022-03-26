import React, { useEffect, useRef } from 'react';
import { Rect, Circle, Line, Arrow, Transformer } from 'react-konva';


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

    const transformTriHandler = (e) => {
        const point = shapeObj.property.points;
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          ...shapeObj.property,
          x: node.x(),
          y: node.y(),
          points: [point[0]*scaleX, point[1]*scaleY, point[2]*scaleX, point[3]*scaleY, point[4]*scaleX, point[5]*scaleX]
        });
    }

    const transformArrowHandler = (e) => {
        const point = shapeObj.property.points;
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          ...shapeObj.property,
          x: node.x(),
          y: node.y(),
          points: [point[0]*scaleX, point[1]*scaleY, point[2]*scaleX, point[3]*scaleY]
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
                }}
                draggable={mode === 'choice' ? true:false}
                onDragEnd={positionEditHandler}
                onTransformEnd={transformHandler}/>
        :shapeObj.detailType === 'circle'?
            <Circle 
                ref={shapeRef}
                {...shapeObj.property}
                onClick={() => {
                    mode === 'choice' &&
                    onSelect();
                }}
                draggable={mode === 'choice' ? true:false}
                onDragEnd={positionEditHandler}
                onTransformEnd={transformCircleHandler}/>
        :shapeObj.detailType === 'tri'?
            <Line
                ref={shapeRef}
                {...shapeObj.property}
                onClick={() => {
                    mode === 'choice' &&
                    onSelect();
                }}
                draggable={mode === 'choice' ? true:false}
                onDragEnd={positionEditHandler}
                onTransformEnd={transformTriHandler}/>
        :shapeObj.detailType === 'arrow'?
            <Arrow 
                ref={shapeRef}
                {...shapeObj.property}
                onClick={() => {
                    mode === 'choice' &&
                    onSelect();
                }}
                draggable={mode === 'choice' ? true:false}
                onDragEnd={positionEditHandler}
                onTransformEnd={transformArrowHandler}/>
        :<></>}
        {mode === 'choice' && isSelected && 
        <Transformer 
            ref={transRef}
            boundBoxFunc={boundBoxFunc}
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
        />}
        </>
    );
}

export default Shape;