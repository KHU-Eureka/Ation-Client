import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Layer, Stage } from 'react-konva';
import { nanoid } from 'nanoid';
import SockJsClient from 'react-stomp';

import { AttrContextStore as AttrContextImgStore } from '../ideation/store/AttrContext';
import { AttrContextStore } from './store/AttrContext';
import { useFetch, getApi } from '../state';
import { isTrue, createObj } from './state';

import Elements from './Elements';

import bin from '../../assets/svg/board_bin.svg';

function Stageboard(props) {
    const { roomInfo, imgSrc, pinObject, setIsEditing, isEditing } = props;
    const attrStore = useContext(AttrContextStore);
    const attrImgStore = useContext(AttrContextImgStore);
    const { state } = useLocation();
    const $websocket = useRef(null); // socket
    const stageRef = useRef();

    const [boardObjectList, setBoardObjectList] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentObject, setCurrentObject] = useState();
    const [selectedObject, setSelectedObject] = useState(null);
    const [exportImg, setExportImg] = useState();
    // const [whiteboard, setWhiteboard] = useState();

    const whiteboard = useFetch(state!==null && roomInfo===undefined && `${process.env.REACT_APP_SERVER_HOST}/api/ideation/${state.ideationId}`);

    // useEffect(() => {console.log(whiteboard);}, [state.ideationId])

    //화이트보드 api get
    useEffect(() => {
        if(state !== null) {
            if(whiteboard !== undefined){
                //화이트보드 JSON 형태로 가져오는 부분 !
                const boardItem = JSON.parse(whiteboard.whiteboard);
                setBoardObjectList(boardItem);
            }
        }
    }, [whiteboard])

    //화이트보드 받아오는 부분 !
    useEffect(()=> { 
        if(roomInfo !== undefined) {
            const getLoungeBoard = async () => {
                const token = localStorage.getItem('token')
                try {
                    const res = await axios.get(
                        `${process.env.REACT_APP_SERVER_HOST}/api/lounge/${roomInfo.id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    )
                    if(res.data.whiteboard !== null && res.data.whiteboard !== undefined) {
                        const board = JSON.parse(res.data.whiteboard);
                        setBoardObjectList([board]);
                    }
                } catch(err) {
                    console.log(err)
                }
            }
            getLoungeBoard();
        }
    }, [])

    function dataURItoBlob(dataURI) {
        let byteString = window.atob(dataURI.split(',')[1]);
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++)
        {
            ia[i] = byteString.charCodeAt(i);
        }

        let bb = new Blob([ab], { "type": mimeString });
        return bb;
    }

    const imgExportHandler = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${process.env.REACT_APP_SERVER_HOST}/api/ideation/image/${state.ideationId}`, exportImg)
        attrImgStore.setThumbnail(response.data);
    }

    useEffect(() => {
        if(exportImg !== undefined) {
            imgExportHandler();
            attrStore.setMode('choice');
        }
    }, [exportImg])

    function readImage (dataUrl) {
        var blob = dataURItoBlob(dataUrl);
        var formData = new FormData();
        formData.append('ideationImg', blob);
        setExportImg(formData);
    }

    useEffect(() => {
        if(attrStore.mode === 'export') {
            const dataURL = stageRef.current.toDataURL({ pixelRatio: 3 });
            readImage(dataURL);
        }
    }, [attrStore.mode])

    const mouseDownHandler = ({ target }) => {
        setIsDrawing(true);
        if(target === stageRef.current) {
            const pos = target.getStage().getPointerPosition();
            switch(attrStore.mode) {
                case 'pen':
                    if(attrStore.detailMode === 'pen') {
                        setBoardObjectList([...boardObjectList, createObj(attrStore.mode, attrStore.detailMode, pos.x, pos.y, {color: attrStore.color, width: attrStore.width})]);
                    } else if(attrStore.detailMode === 'highlight') {
                        setBoardObjectList([...boardObjectList, createObj(attrStore.mode, attrStore.detailMode, pos.x, pos.y, {color: attrStore.color, width: attrStore.width})]);
                    }
                    break;
                case 'shape':
                    if(attrStore.detailMode === 'rect') {
                        setBoardObjectList([...boardObjectList, createObj(attrStore.mode, attrStore.detailMode, pos.x, pos.y, {color: attrStore.color, width: attrStore.width})]);
                    } else if(attrStore.detailMode === 'tri') {
                        setBoardObjectList([...boardObjectList, createObj(attrStore.mode, attrStore.detailMode, pos.x, pos.y, {color: attrStore.color, width: attrStore.width})]);
                    } else if(attrStore.detailMode === 'circle') {
                        setBoardObjectList([...boardObjectList, createObj(attrStore.mode, attrStore.detailMode, pos.x, pos.y, {color: attrStore.color, width: attrStore.width})]);
                    } else if(attrStore.detailMode === 'arrow') {
                        setBoardObjectList([...boardObjectList, createObj(attrStore.mode, attrStore.detailMode, pos.x, pos.y, {color: attrStore.color, width: attrStore.width})]);
                    } 
                    break;
                case 'text':
                    setBoardObjectList([...boardObjectList, createObj(attrStore.mode, attrStore.detailMode, pos.x, pos.y, {text: attrStore.text})]);
                    setIsEditing(false);
                    break;
                case 'postit':
                    setBoardObjectList([...boardObjectList, createObj(attrStore.mode, attrStore.detailMode, pos.x, pos.y, {text: attrStore.text, color: attrStore.color})]);
                    setIsEditing(false);
                    break;
                case 'choice':
                    break;
            }
        }
    }

    const mouseMoveHandler = ({ target }) => {
        if(isDrawing && target === stageRef.current) {
            const pos = target.getStage().getPointerPosition();
            let lastObj = boardObjectList[boardObjectList.length - 1];
            if(attrStore.mode === 'pen') {
                if(attrStore.detailMode !== 'eraser') {
                    lastObj.property.points = lastObj.property.points.concat([pos.x-lastObj.property.x, pos.y - lastObj.property.y]);
                }
            } else if(attrStore.mode === 'shape') {
                if(attrStore.detailMode === 'rect') {
                    lastObj.property.width = pos.x - lastObj.property.x;
                    lastObj.property.height = pos.y - lastObj.property.y;
                } else if(attrStore.detailMode === 'circle') {
                    if((pos.x - lastObj.property.x) > 0) {
                        lastObj.property.radius = (pos.x - lastObj.property.x)/2;
                    } else {
                        lastObj.property.radius = (lastObj.property.x - pos.x)/2;
                    }
                } else if(attrStore.detailMode === 'tri') {
                    let x = 0;
                    let y = 0;
                    if((lastObj.property.y - pos.y) < 0) {
                        x = (pos.x - lastObj.property.x) /2;
                        y = (lastObj.property.y - pos.y)/2;
                        lastObj.property.points = [x, y, 0, -y, -x, y];
                    } else {
                        x = (lastObj.property.x - pos.x)/2;
                        y = (lastObj.property.y - pos.y)/2;
                        lastObj.property.points = [x, y, 0, -y, -x, y];
                    }
                } else if(attrStore.detailMode === 'arrow') {
                    lastObj.property.points = [0, 0, pos.x - lastObj.property.x, pos.y - lastObj.property.y];
                } 
            }
            boardObjectList.splice(boardObjectList.length - 1, 1, lastObj);
            setBoardObjectList(boardObjectList.concat());
        }
    }

    const mouseUpHandler = () => {
        if(attrStore.mode === 'shape' || attrStore.mode === 'text' || attrStore.mode === 'postit') {
            attrStore.setMode('choice');
        }
        setIsDrawing(false);
        if(roomInfo !== undefined) {
            sendMessage();
        }
    }

    useEffect(() => {
        if(attrStore.mode === 'choice') {
            if(roomInfo !== undefined) {
                sendMessage();
            } 
        }
    }, [attrStore.mode])

    const dropHandler = (e) => {
        e.preventDefault();
        setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'pin', detailType: null, property: { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, content: pinObject } }]);
        attrStore.setMode('choice');
    }

    const dragOverHandler = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        if(attrStore.mode === 'image') {
            setBoardObjectList([...boardObjectList, { ...createObj(attrStore.mode, attrStore.detailMode), image: imgSrc }]);
            attrStore.setMode('choice');
        }
    }, [imgSrc])

    const contextMenuHandler = (e) => {
        e.evt.preventDefault();
        if(e.target === stageRef.current) {
            const menuDoc = document.querySelector('.menu-Container');
            if(menuDoc.classList.contains('menu-display')) menuDoc.classList.remove('menu-display');
            return;
        }

        setCurrentObject(e.target);
        const menuDoc = document.querySelector('.menu-Container');
        const menuStyle = menuDoc.style;
        const pos = e.target.getStage().getPointerPosition();
        menuDoc.classList.add('menu-display');
        menuStyle.display = 'inline-flex';
        menuStyle.top = `${pos.y + 50}px`;
        menuStyle.left = `${pos.x + 350}px`;
    }

    const clickHandler = (e) => {
        const menuStyle = document.querySelector('.menu-Container').style;
        menuStyle.display = 'none';
        if(e.target === e.target.getStage()) setSelectedObject(null);
        if(attrStore.detailMode === 'eraser' && e.target.constructor.name === 'Line') {
            if(e.target.attrs.globalCompositeOperation === 'source-over') {
                const temp = boardObjectList.filter((i) => i.id !== e.target.attrs.id);
                setBoardObjectList(temp);
            }
        }
    }

    const deleteHandler = () => {
        const menuStyle = document.querySelector('.menu-Container').style;
        currentObject.destroy();
        menuStyle.display = 'none';
        const temp = boardObjectList.filter( obj => obj.id !== currentObject.attrs.id);
        setBoardObjectList(temp);
    }

    //화이트보드 저장
    useEffect( async () => {
        const token = localStorage.getItem('token');
        //화이트보드 String 형태로 api에 저장하는 부분 !
        const stringObjectList = JSON.stringify(boardObjectList);
        if(state !== null) {
            console.log(stringObjectList)
            if(stringObjectList !== "[]") {
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
            }
        } else {
           
        }
    }, [boardObjectList])

    const sendMessage = () => {
        const stringObjectList = JSON.stringify(boardObjectList);
        console.log(stringObjectList)
        try {
            $websocket.current.sendMessage(`/lounge/${roomInfo.id}/whiteboard/receive`, `{"whiteboard": ${stringObjectList}}`);
        } catch(err) {
            console.log(err);
        }
    }

    const receiveMessage = (msg) => { 
        if(msg !== undefined) setBoardObjectList(msg.whiteboard);
    }

    return (
        <div>
        {roomInfo !== undefined &&
        <SockJsClient
            url="http://ation-server.seohyuni.com/ws"
            topics={[`/lounge/${roomInfo.id}/whiteboard/receive`, 
                    `/lounge/${roomInfo.id}/whiteboard/send`,]}
            onMessage={msg => { receiveMessage(msg); console.log(msg); }} 
            ref={$websocket}
        />}
        <div className="stageboard-container" onDrop={dropHandler} onDragOver={dragOverHandler} style={{position: 'relative'}}>
            <Stage ref={stageRef} width={1607} height={window.innerHeight-20} onMouseDown={mouseDownHandler} onMouseMove={mouseMoveHandler} onMouseUp={mouseUpHandler} onContextMenu={contextMenuHandler} onClick={clickHandler}>
                <Layer>
                    {boardObjectList && boardObjectList.map( (obj, i) => <Elements key={i} type={obj.type} obj={obj}
                    isSelected={isTrue(obj.id, selectedObject)}
                    onSelect={ () => setSelectedObject(obj.id) }
                    onChange={ (newAttrs) => {
                        const objs = boardObjectList.slice();
                        objs[i].property = newAttrs;
                        setBoardObjectList(objs);
                        roomInfo !== undefined && sendMessage();
                    }}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    mode={attrStore.mode}
                    /> )}
                    
                </Layer>
            </Stage>
        </div>
        <div className='menu-Container' style={{ display: 'none', position: 'absolute', background: 'white' }}>
            <div className='delete-button' onClick={deleteHandler}>
                <img src={bin} style={{marginRight: '4px'}}/>
                <span>삭제</span>
            </div>
        </div>
        </div>
    );
}

export default Stageboard;











































////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// if(mode === 'pen') {
            //     if(attrStore.detailMode === 'pen') {
            //         setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'pen', detailType: 'pen', property: { points: [pos.x, pos.y], width: 0, height: 0, content: null } }]);
            //     } else if(attrStore.detailMode === 'highlighter') {
            //         setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'pen', detailType: 'highlighter', points: [pos.x, pos.y], property: { content: null } }]);
            //     } else if(attrStore.detailMode === 'eraser') {
            //         setCurrentObject(target);
            //     }
            // } else if(mode === 'shape') {
            //     if(attrStore.detailMode === 'rect') {
            //         setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'shape', detailType: 'rect', property: { x: pos.x, y: pos.y, width: 0, height: 0 } }]);
            //     } else if(attrStore.detailMode === 'tri') {
            //         setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'shape', detailType: 'tri', points: [pos.x, pos.y, 0, 0], property: { content: null } }]);
            //     } else if(attrStore.detailMode === 'circle') {
            //         setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'shape', detailType: 'circle', property: { x: pos.x, y: pos.y, radius: 0 } }]);
            //     } else if(attrStore.detailMode === 'line') {
            //         setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'shape', detailType: 'line', points: [pos.x, pos.y, 0, 0], property: { content: null } }]);
            //     }
            // } else if(mode === 'text') {
            //     //textarea 관련 ...
            //     if(document.querySelector('textarea')) {
            //         const textareaStyle = document.querySelector('textarea').style;
            //         if(text === '') {
            //             setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'text', detailType: null, property: { x: pos.x, y: pos.y, text: text, fontSize: 20 } }]);
            //             textareaStyle.display = 'inline';
            //             textareaStyle.position = 'absolute';
            //             textareaStyle.top = pos.y + 'px';
            //             textareaStyle.left = pos.x + 'px';
            //         } else {
            //             console.log(selectedObject)
            //             console.log(text)
            //             // let lastObj = boardObjectList[boardObjectList.length - 1];
            //             // lastObj.property.text = text;
            //             boardObjectList.map( obj => obj.id === selectedObject?obj.property.text = text:null);
            //             textareaStyle.display = 'none';
            //         }
            //     }
            //     //...textarea 관련
            // } else if(mode === 'postit') {
            //     const textareaStyle = document.querySelector('textarea').style;
            //     if(text === '') {
            //         setBoardObjectList([...boardObjectList, { id: nanoid(), type: 'postit', detailType: null, property: { x: pos.x, y: pos.y, text: text } }]);
            //         textareaStyle.display = 'inline';
            //         textareaStyle.position = 'absolute';
            //         textareaStyle.top = pos.y + 'px';
            //         textareaStyle.left = pos.x + 'px';
            //     } else {
            //         let lastObj = boardObjectList[boardObjectList.length - 1];
            //         lastObj.property.text = text;
            //         textareaStyle.display = 'none';
            //     }
            // } else if(mode === 'choice') {
            //     for(var obj of boardObjectList) {
            //         if(obj.id === selectedObject && obj.type === 'text') {
            //             const textareaStyle = document.querySelector('textarea').style;
            //             obj.property.text = text;
            //             textareaStyle.display = 'none';
            //             console.log(selectedObject)
            //             console.log(text)
            //             setIsEditing(true);
            //         }
            //     }





//return

{/* //     <Pen 
                    //         key={i} 
                    //         penObj={obj}
                    //         isSelected={obj.id === selectedObject}
                    //         onSelect={ () => setSelectedObject(obj.id) }
                    //         onChange={ (newAttrs) => {
                    //             const objs = boardObjectList.slice();
                    //             objs[i].property = newAttrs;
                    //             setBoardObjectList(objs);
                    //             console.log(newAttrs)
                    //         }}
                    //         setIsEditing={setIsEditing}
                    //         mode={mode}
                    //     />
                    // :obj.type === 'shape'?
                    //     <Shape 
                    //         key={i} 
                    //         shapeObj={obj} 
                    //         isSelected={obj.id === selectedObject}
                    //         onSelect={ () => setSelectedObject(obj.id) }
                    //         onChange={ (newAttrs) => {
                    //             const objs = boardObjectList.slice();
                    //             objs[i].property = newAttrs;
                    //             setBoardObjectList(objs);
                    //             console.log(newAttrs)
                    //         }}
                    //         setIsEditing={setIsEditing}
                    //     />
                    // :obj.type === 'text'?
                    //     <Letter 
                    //         ref={textRef}
                    //         key={i} 
                    //         textObj={obj} 
                    //         setText={setText} 
                    //         text={text} 
                    //         isSelected={obj.id === selectedObject}
                    //         onSelect={ () => setSelectedObject(obj.id) }
                    //         onChange={ (newAttrs) => {
                    //             const objs = boardObjectList.slice();
                    //             objs[i].property = newAttrs;
                    //             setBoardObjectList(objs);
                    //             console.log(newAttrs)
                    //         }}
                    //         isEditing={isEditing}
                    //         setIsEditing={setIsEditing}
                    //         mode={mode}
                    //     />
                    // :obj.type === 'postit'?
                    //     <Postit 
                    //         key={i} 
                    //         postObj={obj} 
                    //         setText={setText} 
                    //         text={text}
                    //         isSelected={obj.id === selectedObject}
                    //         onSelect={ () => setSelectedObject(obj.id) }
                    //         onChange={ (newAttrs) => {
                    //             const objs = boardObjectList.slice();
                    //             objs[i].property = newAttrs;
                    //             setBoardObjectList(objs);
                    //             console.log(newAttrs)
                    //         }} 
                    //     />
                    // :obj.type === 'image'?
                    //     <Image 
                    //         key={i} 
                    //         imgObj={obj}
                    //         isSelected={obj.id === selectedObject}
                    //         onSelect={ () => setSelectedObject(obj.id) }
                    //         onChange={ (newAttrs) => {
                    //             const objs = boardObjectList.slice();
                    //             objs[i].property = newAttrs;
                    //             setBoardObjectList(objs);
                    //             console.log(newAttrs)
                    //         }}  
                    //     />
                    // :obj.type === 'pin'?
                    //     <Pin key={i} pinObj={obj} /> */}




                    // const stageNode = document.querySelector('.stageboard-container');
                    // const textArea = document.createElement('textarea');
                    // textArea.setAttribute('autofocus', true);
                    // textArea.setAttribute('style', `display: inline-block; position: absolute; top: ${pos.y + 95}px; left: ${pos.x + 290}px; border: 0.5px solid #D7D2C8; max-width: 100px;`);
                    // stageNode.appendChild(textArea);
                    // textArea.onChange = function textEditHandler(e) {
                    //     console.log("asdf")
                    //     attrStore.setText(e.target.value);
                    //     console.log(attrStore.text)
                    // };
                    // if(document.querySelector('textarea')) {
                    //     const textareaStyle = document.querySelector('textarea').style;
                    //     if(text === '') {
                    //         textareaStyle.display = 'inline';
                    //         textareaStyle.position = 'absolute';
                    //         textareaStyle.top = pos.y + 'px';
                    //         textareaStyle.left = pos.x + 'px';
                    //     } else {
                    //         boardObjectList.map( obj => obj.id === selectedObject?obj.property.text = text:null);
                    //         textareaStyle.display = 'none';
                    //     }
                    // }

                    // function textEditHandler(e) {
    //     attrStore.setText(e.target.value);
    //     console.log(attrStore.text);
    // };

    // useEffect(() => {
    //     if(document.querySelector('textarea')) {
    //         document.querySelector('textarea').addEventListener('keydown', textEditHandler);
    //         return () => document.querySelector('textarea').removeEventListener('change', textEditHandler);
    //     }
    // }, [])

    // function textOutClickHandler() {
    //     const textArea = document.querySelector('textarea');
    //     const stageNode = document.querySelector('.stageboard-container');
    //     attrStore.setText(textArea.value);
    //     stageNode.removeChild(textArea);
    //     console.log(attrStore.text);
    //     let lastObj = boardObjectList[boardObjectList.length - 1];
    //     lastObj.property.text = attrStore.text;
    //     setIsEditing(true);
    // }

    // for(var obj of boardObjectList) {
                    //     if(obj.id === selectedObject && obj.type === 'text') {
                    //         const textareaStyle = document.querySelector('textarea').style;
                    //         obj.property.text = text;
                    //         textareaStyle.display = 'none';
                    //         setIsEditing(true);
                    //     }
                    // }


                     // if(document.querySelector('textarea') && target !== document.querySelector('textarea')) {
                    //     // textOutClickHandler();
                    //     // window.addEventListener('click', textOutClickHandler);
                    // }

                    // useEffect(() => {
    //     //오브젝트 리스트 길이가 1 증가하고 && 그 타입이 텍스트라면, selectedobject를 그것의 id로 설정
    //     if(attrStore.mode === 'text') {
    //         let lastObj = boardObjectList[boardObjectList.length - 1];
    //         setSelectedObject(lastObj.id);
    //     }
    // }, [boardObjectList.length])


    // if(document.querySelector('textarea')) {
                    //     const textareaStyle = document.querySelector('textarea').style;
                    //     if(text === '') {
                    //         setBoardObjectList([...boardObjectList, createObj(attrStore.mode, attrStore.detailMode, pos.x, pos.y, attrStore.color)]);
                    //         textareaStyle.display = 'inline';
                    //         textareaStyle.position = 'absolute';
                    //         textareaStyle.top = pos.y + 'px';
                    //         textareaStyle.left = pos.x + 'px';
                    //     } else {
                    //         let lastObj = boardObjectList[boardObjectList.length - 1];
                    //         lastObj.property.text = text;
                    //         textareaStyle.display = 'none';
                    //     }
                    // }