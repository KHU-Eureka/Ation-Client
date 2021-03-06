import React, { useEffect, useRef } from 'react';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';

function Img(props) {
    const { imgObj, isSelected, onSelect, onChange, setIsEditing, mode } = props;
    const imgRef = useRef();
    const transRef = useRef();

    const [image] = useImage(imgObj.image, 'Anonymous');

    useEffect(() => {
        if (mode === 'choice' && isSelected) {
            transRef.current.nodes([imgRef.current]);
            transRef.current.getLayer().batchDraw();
        }
      }, [isSelected]);

    const positionEditHandler = (e) => {
        onChange(
            {
                ...imgObj.property,
                x: e.target.x(),
                y: e.target.y(),
            }
        );
    }

    const transformHandler = (e) => {
        const node = imgRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange(
            {
                ...imgObj.property,
                x: node.x(),
                y: node.y(),
                width: Math.max(5, node.width() * scaleX),
                height: Math.max(node.height() * scaleY),
            }
        );
    }

    const boundBoxFunc = (oldBox, newBox) => {
        if (newBox.width < 5 || newBox.height < 5) {
            return oldBox;
        }
        return newBox;
    }

    return (
        <>
        <Image 
            id={imgObj.id}
            ref={imgRef} 
            {...imgObj.property}
            image={image}
            onClick={() => {
                if(mode === 'choice') {
                    onSelect();
                }
            }}
            draggable={mode === 'choice'?true:false}
            onDragEnd={positionEditHandler}
            onTransformEnd={transformHandler}
        />
        {mode === 'choice' && isSelected && 
        <Transformer 
            ref={transRef}
            boundBoxFunc={boundBoxFunc}
        />}
        </>
    );
}

export default Img;