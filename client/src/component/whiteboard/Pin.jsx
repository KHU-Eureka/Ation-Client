import React from 'react';
import { Group, Rect } from 'react-konva';
import { Html } from 'react-konva-utils';

function UrlImage(props) {
    const { pinObj, mode, onSelect, onChange } = props;

    const goPinClickHandler = () => {
        window.open(pinObj.property.content.insight.url);
    }

    const positionEditHandler = (e) => {
        onChange(
            {
                ...pinObj.property,
                x: e.target.x(),
                y: e.target.y(),
            }
        );
    }

    const pinFooterStyle = {
        logoImg: {
            width: '12.86px',
            height: '12.86px',
            borderRadius: '50%',
        },
        siteName: {
            fontFamily: 'Pretendard',
            fontStyle: 'normal',
            fontWeight: '500',
            fontSize: '11px',
            color: '#352C23',
            marginLeft: '9.35px',
        },
        btn: {
            width: '68px',
            height: '19px',
            background: '#FFFFFF',
            boxShadow: '1px 8px 20px rgba(0, 0, 0, 0.07)',
            borderRadius: '10px',
            fontFamily: 'Pretendard',
            fontStyle: 'normal',
            fontWeight: '500',
            fontSize: '11px',
            color: '#352C23',
            border: 'none',
            marginLeft: '19.85px',
            cursor: 'pointer',
        }
    }

    const flexCenterStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }

    const flexBoxStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    }

    const titleStyle = {
        width: '172px',
        textOverflow: 'ellipsis',
        fontFamily: 'Pretendard',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '11px',
        color: '#352C23',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    }

    return (
    <>
    <Group {...pinObj.property} draggable={mode==='choice'?true:false} 
            onClick={ () => {mode === 'choice' && onSelect();}} 
            onDragEnd={positionEditHandler}>
        <Html>
            <div style={{...flexCenterStyle, flexDirection: 'column'}}>
                <img src={pinObj.property.content.pinImgPath} width='195px' height='110px' style={{webkitUserDrag: 'none'}}/>
                <div style={flexCenterStyle}>
                    <div style={{marginTop: '11px'}}>
                        <div style={titleStyle}>
                            <span>{pinObj.property.content.insight.title}</span>
                        </div>
                        <div style={{...flexBoxStyle, marginTop: '30px'}}>
                            <div>
                                <img src={pinObj.property.content.insight.icon} style={{...pinFooterStyle.logoImg, webkitUserDrag: 'none'}}/>
                                <span style={pinFooterStyle.siteName}>{pinObj.property.content.insight.siteName}</span>
                            </div>
                            <button onClick={goPinClickHandler} style={pinFooterStyle.btn}>바로가기</button>
                        </div>
                    </div>
                </div>
            </div>
        </Html>
        <Rect width={195} height={195} fill="#F5F5F5" stroke="#D7D2C8" strokeWidth={1} shadowColor='black' shadowBlur={10} shadowOpacity={0.2} zIndex={99}/>
    </Group>
    </>
    );
}

export default UrlImage;