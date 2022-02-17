import React from 'react';
import { Rect, Circle, Line } from 'react-konva';


function Shape(props) {
    const { shapeObj } = props;

    return (
        <>
        {shapeObj.detailType === 'rect'?
            <Rect
                x={shapeObj.points[0]}
                y={shapeObj.points[1]}
                width={shapeObj.points[2]}
                height={shapeObj.points[3]}
                fill="red"
            />
        :shapeObj.detailType === 'circle'?
            <Circle x={shapeObj.points[0]} y={shapeObj.points[1]} radius={shapeObj.points[2]} fill="green" />
        :<></>}
        </>
    );
}

export default Shape;