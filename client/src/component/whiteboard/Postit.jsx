import React, { useEffect, useRef } from 'react';
import { Group, Text, Rect, Transformer } from 'react-konva';

function Postit(props) {
    const { postObj, setText, text, isSelected, onSelect, onChange, setIsEditing } = props;
    const postRef = useRef();
    const transRef = useRef();

    // useEffect(() => {
    //     if (isSelected) {
    //         transRef.current.nodes([postRef.current]);
    //         transRef.current.getLayer().batchDraw();
    //     }
    //   }, [isSelected]);

    const positionEditHandler = (e) => {
        onChange(
            {
                ...postObj.property,
                x: e.target.x(),
                y: e.target.y(),
            }
        );
    }

    const postClickHandler = (e) => {
        const pos = e.target.getStage().getPointerPosition();
        setText(e.target.attrs.text);
        if(document.querySelector('textarea')) {
            const textareaStyle = document.querySelector('textarea').style;
            textareaStyle.display = 'inline';
            textareaStyle.position = 'absolute';
            textareaStyle.top = pos.y + 'px';
            textareaStyle.left = pos.x + 'px';
            postObj.property.content = text;
        }
    }

    return (
        <Group ref={postRef} id={postObj.id} x={postObj.property.x} y={postObj.property.y} 
            onClick={() => {
                onSelect();
                setIsEditing(true);
            }}
            draggable
            onDragEnd={positionEditHandler}
        >
            <Rect id={postObj.id} width={100} height={100} fill={'aquamarine'} />
            <Text text={postObj.property.text} onClick={postClickHandler} />
        </Group>
    );
}

export default Postit