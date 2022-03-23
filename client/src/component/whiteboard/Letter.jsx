import React, { useEffect, useRef } from 'react';
import { Text, Transformer } from 'react-konva';

function Letter(props) {
    const { textObj, setText, text, isSelected, onSelect, onChange, isEditing, setIsEditing, mode } = props;
    const textRef = useRef();
    const transRef = useRef();

    // useEffect(() => {
    //     if (isSelected) {
    //         transRef.current.nodes([textRef.current]);
    //         transRef.current.getLayer().batchDraw();
    //     }
    //   }, [isSelected]);

    useEffect(() => {
        if(!document.querySelector('textarea') && isEditing === true) {
            textRef.current.show();
            setIsEditing(false);
        } else {
            textRef.current.hide();
        }
    }, [isEditing])

    const positionEditHandler = (e) => {
        onChange(
            {
                ...textObj.property,
                x: e.target.x(),
                y: e.target.y(),
            }
        );
    }

    const textDBClickHandler = (e) => {
        if(mode === 'choice') {
            const pos = e.target.getStage().getPointerPosition();
            setText(e.target.attrs.text);
            if(document.querySelector('textarea')) {
                const textArea = document.querySelector('textarea');
                const textareaStyle = textArea.style;
                console.log( textRef.current.text(), textArea.value)
                textareaStyle.display = 'inline';
                textareaStyle.position = 'absolute';
                textareaStyle.top = pos.y + 'px';
                textareaStyle.left = pos.x + 'px';
                // textArea.value = textRef.current.text();
                textArea.focus();
                textObj.property.text = text;
            }
            textRef.current.hide();
            transRef.current.hide();
        }
    }

    const transformHandler = (e) => {
        const node = textRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        console.log(node.fontSize()*node.scaleX(), node.scaleX())
        onChange(
            {
                ...textObj.property,
                x: node.x(),
                y: node.y(),
                width: Math.max(node.width()*scaleX, 5),
                height: Math.max(node.height()*scaleY),
                fontSize: node.fontSize()*scaleX,
            }
        );
    }

    const boundBoxFunc = (oldBox, newBox) => {
        if (newBox.width < 5 || newBox.height < 5) {
            return oldBox;
        }
        return newBox;
    }

    const textClickHandler = (e) => {
        if(mode === 'choice') {
            setText(e.target.attrs.text);
            onSelect();
        }
    }

    const h = (e) => {
        const node = textRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        // node.scaleX(1);
        // node.scaleY(1);
        console.log(node)
        onChange(
            {
                ...textObj.property,
                x: node.x(),
                y: node.y(),
                width: Math.max(node.width(), 5),
                height: Math.max(node.height() ),
            }
        );
    }

    return (
        <>
        <Text 
            id={textObj.id}
            ref={textRef}
            {...textObj.property}
            onClick={textClickHandler}
            draggable={mode==='choice'?true:false}
            onDragEnd={positionEditHandler}
            onTransformEnd={transformHandler}
            // onTransform={h}
        />
        {mode === 'choice' && isSelected &&
        <Transformer ref={transRef} boundBoxFunc={boundBoxFunc} keepRatio />
        }
        </>
    );
}

export default Letter;