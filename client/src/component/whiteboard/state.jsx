import { createStore } from "@halka/state";
import produce from "immer";
import { nanoid } from "nanoid";

import { TYPES, DEFAULTS } from "./constant";

export const createObj = (mode, detail_mode, x, y, attr) => {
    const obj = { id: nanoid(), type: mode, detailType: detail_mode, property: {}};
    switch(mode) {
        case 'pen':
            obj.property = {
                stroke: attr.color,
                strokeWidth: attr.width,
                lineCap:  DEFAULTS.PEN.LINECAP,
                opacity: detail_mode === 'pen'?DEFAULTS.PEN.OPACITY:DEFAULTS.HIGHLIGHT.OPACITY,
                width: DEFAULTS.PEN.WIDTH,
                height: DEFAULTS.PEN.HEIGHT,
                points: DEFAULTS.PEN.POINTS,
                x: x,
                y: y,
            }
            break;
        case 'shape':
            switch(detail_mode) {
                case 'rect':
                    obj.property = {
                        stroke: DEFAULTS.RECT.STROKE,
                        fill: attr.color,
                        strokeWidth: attr.width,
                        width: DEFAULTS.RECT.WIDTH,
                        height: DEFAULTS.RECT.HEIGHT,
                        x: x,
                        y: y,
                    }
                    break; 
                case 'circle':
                    obj.property = {
                        stroke: DEFAULTS.RECT.STROKE,
                        fill: attr.color,
                        strokeWidth: attr.width,
                        radius: DEFAULTS.CIRCLE.RADIUS,
                        x: x,
                        y: y,
                    }
                    break;
                case 'tri':
                    obj.property = {
                        stroke: DEFAULTS.RECT.STROKE,
                        fill: attr.color,
                        strokeWidth: attr.width,
                        closed: DEFAULTS.TRI.CLOSED,
                        x: x,
                        y: y,
                        points: DEFAULTS.TRI.POINTS,
                    }
                    break;
                case 'arrow':
                    obj.property = {
                        stroke: DEFAULTS.ARROW.STROKE,
                        fill: attr.color,
                        strokeWidth: attr.width,
                        pointerLength: DEFAULTS.ARROW.POINTERLENGTH,
                        pointerWidth: DEFAULTS.ARROW.POINTERWIDTH,
                        x: x,
                        y: y,
                        points: DEFAULTS.ARROW.POINTS,
                    }
                    break;
            }
            break;
        case 'postit':
            obj.property = {
                text: attr.text,
                fontSize: DEFAULTS.POSTIT.FONTSIZE,
                fontFamily: DEFAULTS.TEXT.FONTFAMILY,
                fontStyle: DEFAULTS.TEXT.FONTSTYLE,
                fill: attr.color,
                width: DEFAULTS.POSTIT.WIDTH,
                height: DEFAULTS.POSTIT.HEIGHT,
                cornerRadius: DEFAULTS.POSTIT.BORDERRADIUS,
                x: x,
                y: y,
            }
            break;
        case 'text':
            obj.property = {
                text: attr.text,
                fontSize: DEFAULTS.TEXT.FONTSIZE,
                fontFamily: DEFAULTS.TEXT.FONTFAMILY,
                fontStyle: DEFAULTS.TEXT.FONTSTYLE,
                x: x,
                y: y,
            }
            break;
        case 'image':
            obj.property = {
                width: DEFAULTS.IMG.WIDTH,
                height: DEFAULTS.IMG.HEIGHT,
                x: DEFAULTS.IMG.X,
                y: DEFAULTS.IMG.Y,
            }
            break;
        
    }
    return obj;
}

export const isTrue = (target1, target2) => {
    return target1 === target2;
}

export const afterTransformer = (newAttrs, obj) => {
    obj.property = newAttrs;
    return obj;
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//const baseState = {
    //     selected: null,
    //     objs: {},
    // };
    
    // export const useObjs = createStore(() => {
    //     const initialState = JSON.parse(locallocalStorage.getItem('board'));
      
    //     return { ...baseState, objs: initialState ?? {} };
    // });
    // const setState = (fn) => useObjs.set(produce(fn));
    
    // export const createRect = ({ x, y }) => {
    //     setState( (state) => {
    //         state.shapes[nanoid()] = {
    //             type: TYPES.RECT,
    //             width: DEFAULTS.RECT.WIDTH,
    //             height: DEFAULTS.RECT.HEIGHT,
    //             fill: DEFAULTS.RECT.FILL,
    //             stroke: DEFAULTS.RECT.STROKE,
    //             x,
    //             y,
    //         };
    //     });
    // };