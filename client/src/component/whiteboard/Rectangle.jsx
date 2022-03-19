import React from 'react';
import { Rect } from 'react-konva';

export default function Rectangle({...shapeProps}) {
    return(
        <Rect
        {...shapeProps}
            />
    );
}