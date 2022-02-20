import React from 'react';
import { Group, Rect } from 'react-konva';
import { Html } from 'react-konva-utils';

function UrlImage(props) {
    const { pinObj } = props;

    const goPinClickHandler = () => {
        window.open(pinObj.content.insight.url);
    }

    return (<>
    <Group draggable x={pinObj.points[0]} y={pinObj.points[1]} draggable>
        <Html>
            <img src={pinObj.content.pinImgPath} width='195px' height='110px'/>
            <p style={{fontSize: '11px'}}>{pinObj.content.insight.title}</p>
            <div>
                <img src={pinObj.content.insight.icon}/>
                <span>{pinObj.content.insight.siteName}</span>
                <button onClick={goPinClickHandler}>바로가기</button>
            </div>
        </Html>
        <Rect width={195} height={195} fill="#F5F5F5"/>
    </Group>
    </>);
}

export default UrlImage;