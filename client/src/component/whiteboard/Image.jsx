import React from 'react';
import { Image } from 'react-konva';

function Img(props) {
    const { imgObj } = props;

    return (
        <Image x={imgObj.points[0]} y={imgObj.points[1]} image={imgObj.content} draggable />
    );
}

export default Img;