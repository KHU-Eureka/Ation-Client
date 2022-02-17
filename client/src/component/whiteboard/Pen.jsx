import React from 'react';
import { Line } from 'react-konva';


function Pen(props) {
    const { penObj } = props;

    return (
        <Line
            points={penObj.points}
            stroke="#df4b26"
            strokeWidth={5}
            tension={0.5}
            lineCap="round"
            globalCompositeOperation={
                penObj.detailType === 'eraser' ? 'destination-out' : 'source-over'
            }
        />
    );
}

export default Pen;