import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Layer, Stage } from 'react-konva';
import useImage from 'use-image';
import { nanoid } from 'nanoid';
import { useLocation } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';

import { useFetch } from '../state';

import Pen from './Pen';
import Shape from './Shape';
import Letter from './Letter';
import Postit from './Postit';
import Image from './Image';
import Pin from './Pin';

function Stageboard(props) {
    const { setText, text, imgSrc, pinObject, setIsEditing, isEditing } = props;

    const { state } = useLocation();

    const cookies = new Cookies();

    const stageRef = useRef();
    const textRef = useRef();

    const mode = useSelector((state)=> state.mode);
    const detailMode = useSelector((state)=> state.detail_mode);

    const [boardObjectList, setBoardObjectList] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentObject, setCurrentObject] = useState();
    const [selectedObject, setSelectedObject] = useState(null);

    const [image] = useImage(imgSrc);

    const whiteboard = useFetch(`${process.env.REACT_APP_SERVER_HOST}/api/ideation/{ideationId}?ideationId=${state.ideationId}`);

    useEffect(() => {
        // if(localStorage.getItem('whiteboard')) {
        if(whiteboard !== undefined){
            // const boardItem = JSON.parse(localStorage.getItem('whiteboard'));
            const boardItem = JSON.parse(whiteboard.whiteboard);
            setBoardObjectList(boardItem);
        }
    }, [whiteboard])

    const mouseDownHandler = (e) => {
        setIsDrawing(true);
        console.log(isEditing)
        if(e.target === stageRef.current) {
            const pos = e.target.getStage().getPointerPosition();
            if(mode === 'pen') {
                if(detailMode === 'pen') {
                    setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'pen', detailType: 'pen', property: { points: [pos.x, pos.y], width: 0, height: 0, content: null } }]);
                } else if(detailMode === 'highlighter') {
                    setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'pen', detailType: 'highlighter', points: [pos.x, pos.y], property: { content: null } }]);
                } else if(detailMode === 'eraser') {
                    setCurrentObject(e.target);
                    //setBoardObjectList([...boardObjectList, { type: 'pen', detailType: 'eraser', points: [pos.x, pos.y], property: { content: null } }]);
                  
                }
            } else if(mode === 'shape') {
                if(detailMode === 'rect') {
                    setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'shape', detailType: 'rect', property: { x: pos.x, y: pos.y, width: 0, height: 0 } }]);
                } else if(detailMode === 'tri') {
                    setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'shape', detailType: 'tri', points: [pos.x, pos.y, 0, 0], property: { content: null } }]);
                } else if(detailMode === 'circle') {
                    setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'shape', detailType: 'circle', property: { x: pos.x, y: pos.y, radius: 0 } }]);
                } else if(detailMode === 'line') {
                    setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'shape', detailType: 'line', points: [pos.x, pos.y, 0, 0], property: { content: null } }]);
                }
            } else if(mode === 'text') {
                //textarea 관련 ...
                if(document.querySelector('textarea')) {
                    const textareaStyle = document.querySelector('textarea').style;
                    if(text === '') {
                        setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'text', detailType: null, property: { x: pos.x, y: pos.y, text: text, fontSize: 20 } }]);
                        textareaStyle.display = 'inline';
                        textareaStyle.position = 'absolute';
                        textareaStyle.top = pos.y + 'px';
                        textareaStyle.left = pos.x + 'px';
                    } else {
                        console.log(selectedObject)
                        console.log(text)
                        // let lastObj = boardObjectList[boardObjectList.length - 1];
                        // lastObj.property.text = text;
                        boardObjectList.map( obj => obj.id === selectedObject?obj.property.text = text:null);
                        textareaStyle.display = 'none';
                    }
                }
                //...textarea 관련
            } else if(mode === 'postit') {
                const textareaStyle = document.querySelector('textarea').style;
                if(text === '') {
                    setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'postit', detailType: null, property: { x: pos.x, y: pos.y, text: text } }]);
                    textareaStyle.display = 'inline';
                    textareaStyle.position = 'absolute';
                    textareaStyle.top = pos.y + 'px';
                    textareaStyle.left = pos.x + 'px';
                } else {
                    let lastObj = boardObjectList[boardObjectList.length - 1];
                    lastObj.property.text = text;
                    textareaStyle.display = 'none';
                }
            } else if(mode === 'choice') {
                for(var obj of boardObjectList) {
                    if(obj.id === selectedObject && obj.type === 'text') {
                        const textareaStyle = document.querySelector('textarea').style;
                        obj.property.text = text;
                        textareaStyle.display = 'none';
                        console.log(selectedObject)
                        console.log(text)
                        setIsEditing(true);
                    }
                }
            }
        }
    }

    const mouseMoveHandler = (e) => {
        if(isDrawing && e.target === stageRef.current) {
            const pos = e.target.getStage().getPointerPosition();
            let lastObj = boardObjectList[boardObjectList.length - 1];
            if(mode === 'pen') {
                if(detailMode === 'eraser') {
                    setCurrentObject(e.target);
                    if(currentObject.constructor.name === 'Line') {
                        //const points = currentObject.attrs.points.find( p => p !== pos.x && p !== pos.y)
                        console.log(currentObject._id, [pos.x, pos.y])

                        currentObject.destroy();
                    }
                    // if(e.target.constructor.name === 'Line' && e.target.attrs.tension) {
                    //     lastObj.points = lastObj.points.concat([pos.x, pos.y]);
                    // }
                } else {
                    lastObj.property.points = lastObj.property.points.concat([pos.x, pos.y]);
                }
            } else if(mode === 'shape') {
                if(detailMode === 'rect') {
                    lastObj.property.width = pos.x - lastObj.property.x;
                    lastObj.property.height = pos.y - lastObj.property.y;
                } else if(detailMode === 'circle') {
                    if((pos.x - lastObj.property.x) > 0) {
                        lastObj.property.radius = (pos.x - lastObj.property.x)/2;
                    } else {
                        lastObj.property.radius = (lastObj.property.x - pos.x)/2;
                    }
                }
            }
            boardObjectList.splice(boardObjectList.length - 1, 1, lastObj);
            setBoardObjectList(boardObjectList.concat());
        }
    }

    const mouseUpHandler = () => {
        setIsDrawing(false);
        console.log(boardObjectList);
        localStorage.setItem('whiteboard', JSON.stringify(boardObjectList));
    }

    const dropHandler = (e) => {
        e.preventDefault();
        setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'pin', detailType: null, points: [e.nativeEvent.offsetX, e.nativeEvent.offsetY], property: { content: pinObject } }]);
    }

    const dragOverHandler = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        console.log(imgSrc)
        if(mode === 'image') {
            setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'image', detailType: null, property: { x: 100, y: 100, width: 300, height: 300 }, image: imgSrc }]);
        }
    }, [imgSrc])

    const contextMenuHandler = (e) => {
        e.evt.preventDefault();
        if(e.target === stageRef.current) return;

        setCurrentObject(e.target);
        const menuStyle = document.querySelector('.menu-Container').style;
        const pos = e.target.getStage().getPointerPosition();
        menuStyle.display = 'initial';
        menuStyle.top = `${pos.y + 4}px`;
        menuStyle.left = `${pos.x + 4}px`;
    }

    const clickHandler = (e) => {
        const menuStyle = document.querySelector('.menu-Container').style;
        menuStyle.display = 'none';
        if(e.target === e.target.getStage()) {
            setSelectedObject(null);
        }
    }

    const deleteHandler = () => {
        const menuStyle = document.querySelector('.menu-Container').style;
        currentObject.destroy();
        menuStyle.display = 'none';
        const temp = boardObjectList.filter( obj => obj.id !== currentObject.attrs.id);
        setBoardObjectList(temp);
    }

    useEffect( async () => {
        const token = cookies.get('token');
        const stringObjectList = JSON.stringify(boardObjectList);
        // const whiteboard = stringObjectList.replace('"', "'");
        try {
            await axios.put(`${process.env.REACT_APP_SERVER_HOST}/api/ideation/whiteboard/${state.ideationId}`,
                {
                    whiteboard : stringObjectList
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );
        } catch(err) {
            console.log(err);
        }
        localStorage.setItem('whiteboard', JSON.stringify(boardObjectList));
    }, [boardObjectList])

    useEffect(() => {
        //오브젝트 리스트 길이가 1 증가하고 && 그 타입이 텍스트라면, selectedobject를 그것의 id로 설정
        if(mode === 'text') {
            let lastObj = boardObjectList[boardObjectList.length - 1];
            setSelectedObject(lastObj.id);
        }
    }, [boardObjectList.length])

    // const dbClickHandler = (e) => {
    //     console.log(selectedObject)
    //     const textareaStyle = document.querySelector('textarea').style;
    //     if(mode === 'text') {
    //         if(e.target !== document.querySelector('textarea')) {
    //             for(var obj of boardObjectList) {
    //                 if(selectedObject === obj.id) {
    //                     obj.property.text = text;
                        
    //                 }
    //             }
    //             // textRef.current.show();
    //             // textNode.text(textarea.value);
    //             textareaStyle.display = 'none';
    //         }
    //     }
    // }

    return (
        <>
        <div onDrop={dropHandler} onDragOver={dragOverHandler}>
            <Stage ref={stageRef} width={window.innerWidth - 297.01} height={window.innerHeight} onMouseDown={mouseDownHandler} onMouseMove={mouseMoveHandler} onMouseUp={mouseUpHandler} onContextMenu={contextMenuHandler} onClick={clickHandler}>
                <Layer>
                    {boardObjectList.map( (obj, i) => obj.type === 'pen'?
                        <Pen 
                            key={i} 
                            penObj={obj}
                            isSelected={obj.id === selectedObject}
                            onSelect={ () => setSelectedObject(obj.id) }
                            onChange={ (newAttrs) => {
                                const objs = boardObjectList.slice();
                                objs[i].property = newAttrs;
                                setBoardObjectList(objs);
                                console.log(newAttrs)
                            }}
                            setIsEditing={setIsEditing}
                            mode={mode}
                        />
                    :obj.type === 'shape'?
                        <Shape 
                            key={i} 
                            shapeObj={obj} 
                            isSelected={obj.id === selectedObject}
                            onSelect={ () => setSelectedObject(obj.id) }
                            onChange={ (newAttrs) => {
                                const objs = boardObjectList.slice();
                                objs[i].property = newAttrs;
                                setBoardObjectList(objs);
                                console.log(newAttrs)
                            }}
                            setIsEditing={setIsEditing}
                        />
                    :obj.type === 'text'?
                        <Letter 
                            ref={textRef}
                            key={i} 
                            textObj={obj} 
                            setText={setText} 
                            text={text} 
                            isSelected={obj.id === selectedObject}
                            onSelect={ () => setSelectedObject(obj.id) }
                            onChange={ (newAttrs) => {
                                const objs = boardObjectList.slice();
                                objs[i].property = newAttrs;
                                setBoardObjectList(objs);
                                console.log(newAttrs)
                            }}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            mode={mode}
                        />
                    :obj.type === 'postit'?
                        <Postit 
                            key={i} 
                            postObj={obj} 
                            setText={setText} 
                            text={text}
                            isSelected={obj.id === selectedObject}
                            onSelect={ () => setSelectedObject(obj.id) }
                            onChange={ (newAttrs) => {
                                const objs = boardObjectList.slice();
                                objs[i].property = newAttrs;
                                setBoardObjectList(objs);
                                console.log(newAttrs)
                            }} 
                        />
                    :obj.type === 'image'?
                        <Image 
                            key={i} 
                            imgObj={obj}
                            isSelected={obj.id === selectedObject}
                            onSelect={ () => setSelectedObject(obj.id) }
                            onChange={ (newAttrs) => {
                                const objs = boardObjectList.slice();
                                objs[i].property = newAttrs;
                                setBoardObjectList(objs);
                                console.log(newAttrs)
                            }}  
                        />
                    :obj.type === 'pin'?
                        <Pin key={i} pinObj={obj} />
                    :<></>)}
                </Layer>
            </Stage>
        </div>
        <div className='menu-Container' style={{ display: 'none', position: 'absolute', background: 'white' }}>
            <div className='delete-button' onClick={deleteHandler}>Delete</div>
        </div>
        </>
    );
}

export default Stageboard;