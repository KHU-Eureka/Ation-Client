import React from 'react';
import { Text, Transformer } from 'react-konva';

function Letter(props) {
    const { textObj, setText, text } = props;

    const textClickHandler = (e) => {
        const pos = e.target.getStage().getPointerPosition();
        setText(e.target.attrs.text);
        if(document.querySelector('textarea')) {
            const textareaStyle = document.querySelector('textarea').style;
            textareaStyle.display = 'inline';
            textareaStyle.position = 'absolute';
            textareaStyle.top = pos.y + 'px';
            textareaStyle.left = pos.x + 'px';
            textObj.content = text;
        }
    }

    return (
        <Text text={textObj.content} x={textObj.points[0]} y={textObj.points[1]} onClick={textClickHandler} draggable/>
    );
}

export default Letter;