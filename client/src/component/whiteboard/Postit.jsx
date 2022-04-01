import React, { useEffect, useRef, useState } from 'react';
import { Group, Rect, Transformer } from 'react-konva';

import Letter from './Letter';

function Postit(props) {
    const { postObj, isSelected, onSelect, onChange, isEditing, setIsEditing, mode } = props;
    const postRef = useRef();
    const transRef = useRef();
    const postTextRef = useRef();

    useEffect(() => {
        if (isSelected) {
            transRef.current.nodes([postRef.current]);
            transRef.current.getLayer().batchDraw();
        }
      }, [isSelected]);

    const positionEditHandler = (e) => {
        const node = postRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange(
            {
                ...postObj.property,
                x: node.x(),
                y: node.y(),
            }
        );
    }

    const transformHandler = (e) => {
        const node = postRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange(
            {
                ...postObj.property,
                x: node.x(),
                y: node.y(),
                width: Math.max(node.width()*scaleX, 5),
                height: Math.max(node.height()*scaleY),
                fontSize: node.attrs.fontSize*scaleX,
            }
        );
    }

    const boundBoxFunc = (oldBox, newBox) => {
        if (newBox.width < 5 || newBox.height < 5) {
            return oldBox;
        }
        return newBox;
    }

    // useEffect(() => {
    //     if(postTextRef.current !== undefined) {
    //         onChange(
    //             {
    //                 ...postObj.property,
    //                 width: postTextRef.current.width() + 50, 
    //                 height: postTextRef.current.height() + 70
    //             }
    //             )
    //     }
    // }, [postTextRef.current])

    return (
        <>
        <Group 
            ref={postRef} 
            id={postObj.id} 
            {...postObj.property} 
            onClick={mode === 'choice' ? onSelect : null}
            draggable={mode==='choice'?true:false}
            onDragEnd={positionEditHandler}
            // onTransform={h}
            onTransformEnd={transformHandler}
            isSelected={isSelected} 
            onSelect={onSelect} 
        >
            <Rect 
                id={postObj.id} 
                fill={postObj.property.fill}
                width={postObj.property.width}
                height={postObj.property.height}
                cornerRadius={postObj.property.cornerRadius}
                x={-22}
                y={-35}
            />

            <Letter 
                textObj={{property: {text: postObj.property.text, fontSize: postObj.property.fontSize, fontFamily: postObj.property.fontFamily, fontStyle: postObj.property.fontStyle,}, id: postObj.id}} 
                isSelected={isSelected} 
                onSelect={onSelect} 
                onChange={onChange} 
                isEditing={isEditing} 
                setIsEditing={setIsEditing} 
                mode={mode}
                isPost={true}
                property={postObj.property}
                postTextRef={postTextRef}
                />

        </Group>
            {mode === 'choice' && isSelected &&
            <Transformer ref={transRef} boundBoxFunc={boundBoxFunc} keepRatio />
            }
        </>
    );
}

export default Postit