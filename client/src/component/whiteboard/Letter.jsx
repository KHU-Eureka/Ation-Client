import React, { useEffect, useRef, useState } from 'react';
import { Group, Text, Transformer } from 'react-konva';
import { TextArea } from './TextArea';

function Letter(props) {
    const { textObj, isSelected, onSelect, onChange, isEditing, setIsEditing, mode, isPost, property } = props;
    const textRef = useRef();
    const transRef = useRef();
    const [isCursor, setIsCursor] = useState({});
    const [isDBClick, setIsDBClick] = useState();

    useEffect(() => {
        if (isSelected && !isPost) {
            transRef.current.nodes([textRef.current]);
            transRef.current.getLayer().batchDraw();
        }
      }, [isSelected]);

    const positionEditHandler = (e) => {
        onChange(
            {
                ...textObj.property,
                x: e.target.x(),
                y: e.target.y(),
            }
        );
    }

    const transformHandler = (e) => {
        const node = textRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
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

    const h = (e) => {
        const node = textRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        // node.scaleX(1);
        // node.scaleY(1);
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
        <Group>
        <Text 
            id={textObj.id}
            ref={textRef}
            {...textObj.property}
            onClick={mode === 'choice' ? onSelect : null}
            draggable={mode==='choice'?true:false}
            onDragEnd={positionEditHandler}
            onTransformEnd={transformHandler}
            visible={isDBClick !== textObj.id}
            onDblClick={(e) => {
                if(mode==='choice') {
                    const absPosition = e.target.getAbsolutePosition();
                    setIsEditing(true);
                    setIsCursor(absPosition);
                    setIsDBClick(textObj.id);
                }
            }}
            onTransform={h}
        />

        {isEditing && isSelected &&
        <Group>
            <TextArea 
            property={isPost?property:textObj.property}
            textRef={textRef}
            onChange={onChange}
            onBlur={() => {
                setIsEditing(false);
                setIsDBClick(0);
            }}
            cursorPosition={isPost?{x: 0, y: 0}:isCursor}
            />
        </Group>
        }

        {mode === 'choice' && isSelected && !isPost &&
        <Transformer ref={transRef} boundBoxFunc={boundBoxFunc} keepRatio />
        }
        </Group>
    );
}

export default Letter;

/////////////////////////////////////////////////////////////////////////////////////

//const textDBClickHandler = (e) => {
    //     if(mode === 'choice') {
    //         const pos = e.target.getStage().getPointerPosition();
    //         setText(e.target.attrs.text);
    //         if(document.querySelector('textarea')) {
    //             const textArea = document.querySelector('textarea');
    //             const textareaStyle = textArea.style;
    //             console.log( textRef.current.text(), textArea.value)
    //             textareaStyle.display = 'inline';
    //             textareaStyle.position = 'absolute';
    //             textareaStyle.top = pos.y + 'px';
    //             textareaStyle.left = pos.x + 'px';
    //             // textArea.value = textRef.current.text();
    //             textArea.focus();
    //             textObj.property.text = text;
    //         }
    //         textRef.current.hide();
    //         transRef.current.hide();
    //     }
    // }


    // const [editorEnabled, setEditorEnabled] = useState(false);

    

    // useEffect(() => {
    //     console.log(isEditing)
    //     // if(!document.querySelector('textarea') && isEditing === true) {
    //     //     textRef.current.show();
    //     //     setIsEditing(false);
    //     // } else {
    //     //     textRef.current.hide();
    //     // }
    // }, [isEditing])