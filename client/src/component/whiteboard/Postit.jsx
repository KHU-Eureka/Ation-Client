import React from 'react';
import { Group, Text, Rect, Transformer } from 'react-konva';

function Postit(props) {
    const { postObj, setText, text } = props;

    const postClickHandler = (e) => {
        const pos = e.target.getStage().getPointerPosition();
        setText(e.target.attrs.text);
        if(document.querySelector('textarea')) {
            const textareaStyle = document.querySelector('textarea').style;
            textareaStyle.display = 'inline';
            textareaStyle.position = 'absolute';
            textareaStyle.top = pos.y + 'px';
            textareaStyle.left = pos.x + 'px';
            postObj.content = text;
        }
    }

    return (
        <Group x={postObj.points[0]} y={postObj.points[1]} draggable>
            <Rect width={50} height={50} fill={'yellow'} />
            <Text text={postObj.content} onClick={postClickHandler} />
        </Group>
    );
}

export default Postit