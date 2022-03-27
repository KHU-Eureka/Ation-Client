import React, { useContext } from "react";

import noProperty from '../../assets/svg/detailTool/noProperty.svg';

import { AttrContextStore } from "./store/AttrContext";

const attrWidth = [
    { px: 0, style: '20px'},
    { px: 1, style: '4px'},
    { px: 2, style: '8px'},
    { px: 3, style: '12px'},
    { px: 4, style: '16px'},
    { px: 5, style: '20px'},
]

const PenW = ({ w }) => {
    const attrStore = useContext(AttrContextStore);

    const widthStyle = {
        background: '#807A74',
        borderRadius: '50%',
        cursor: 'pointer',
        border: 'none',
    }

    const widthStyle_new = {
        border: '1px solid #807A74',
    };
    const widthStyle_prev = {
        border: 'none',
    };

    const widthSettingHandler = () => {
        attrStore.setWidth(w);
    }

    return(
        <>
        {w!==null &&
        <div className="width" onClick={widthSettingHandler} style={w === attrStore.width?widthStyle_new:widthStyle_prev}>
            <div style={{...widthStyle, width: `${attrWidth.find((i) => i.px === w).style}`, height: `${attrWidth.find((i) => i.px === w).style}`}}/>
        </div>
        }
        </>
    );
}

export function ShapeW({ w }) {
    const attrStore = useContext(AttrContextStore);

    const widthStyle = {
        background: '#1E140A',
        borderRadius: '3px',
        cursor: 'pointer',
        border: 'none',
        width: '24px',
    }

    const widthStyle_new = {
        background: '#BEBBB9',
    };
    const widthStyle_prev = {
        background: 'none',
    };

    const widthSettingHandler = () => {
        attrStore.setWidth(w);
    }

    return(
        <div className="width" onClick={widthSettingHandler} style={w === attrStore.width?widthStyle_new:widthStyle_prev}>
            {w!==0?
            <div style={{...widthStyle, height: `${attrWidth.find((i) => i.px === w).px}px`}}/>
            :<img src={noProperty} />}
        </div>
    );
}

export function Width({ type }) {
    return(
        <div className="Width-container">
            {attrWidth.map((i) => type==='pen'?<PenW w={i.px !== 0?i.px:null} />:<ShapeW w={i.px} />)}
        </div>
    );
}