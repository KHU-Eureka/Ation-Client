import React, { useContext } from 'react';

import { AttrContextStore } from './store/AttrContext';

const ColorElem = ({ color }) => {
    const attrStore = useContext(AttrContextStore);

    const colorStyle = {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        cursor: 'pointer',
        border: 'none',
    };

    
    const colorStyle_new = {
        border: `1px solid ${color}`,
    };
    const colorStyle_prev = {
        border: 'none',
    };

    const colorSettingHandler = ({ currentTarget }) => {
        attrStore.setColor(currentTarget.getAttribute('id'));
    }

    return(
        <div className="color" id={color} onClick={colorSettingHandler} style={color === attrStore.color?colorStyle_new:colorStyle_prev}>
            <div style={{...colorStyle, background: color}}></div>
        </div>
    )
}

export default function Color() {
    return(
        <div className='Color-container'>
            <ColorElem color={'#FE3400'} />
            <ColorElem color={'#FFD600'} />
            <ColorElem color={'#00D315'} />
            <ColorElem color={'#00C2FF'} />
            <ColorElem color={'#CB5EFF'} />
            <ColorElem color={'#FFFFFF'} />
            <ColorElem color={'#F5F5F5'} />
            <ColorElem color={'#BEBBB9'} />
            <ColorElem color={'#807A74'} />
            <ColorElem color={'#1E140A'} />
        </div>
    );
}