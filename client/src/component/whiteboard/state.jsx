import { createStore } from "@halka/state";
import produce from "immer";
import { nanoid } from "nanoid";

import { TYPES, DEFAULTS } from "./constant";

export const createObj = (mode, detail_mode, x, y, color) => {
    const obj = { id: nanoid(), type: mode, detailType: detail_mode, property: {}};
    switch(mode) {
        case 'pen':
            obj.property = {
                stroke: color,
                strokeWidth: DEFAULTS.PEN.STROKE_WIDTH,
                lineCap:  DEFAULTS.PEN.LINECAP,
                opacity: detail_mode === 'pen'?DEFAULTS.PEN.OPACITY:DEFAULTS.HIGHLIGHT.OPACITY,
                width: DEFAULTS.PEN.WIDTH,
                height: DEFAULTS.PEN.HEIGHT,
                points: [x, y],
            }
            break;
        case 'shape':
            switch(detail_mode) {
                case 'rect':
                    obj.property = {
                        stroke: color,
                        fill: DEFAULTS.RECT.FILL,
                        width: DEFAULTS.RECT.WIDTH,
                        height: DEFAULTS.RECT.HEIGHT,
                        x: x,
                        y: y,
                    }
                    break; 
                case 'circle':
                    obj.property = {
                        stroke: color,
                        fill: DEFAULTS.CIRCLE.FILL,
                        radius: DEFAULTS.CIRCLE.RADIUS,
                        x: x,
                        y: y,
                    }
                    break;
            }
            break;
        case 'postit':
            obj.property = {
                text: DEFAULTS.POSTIT.CONTENT,
                fontSize: DEFAULTS.POSTIT.FONTSIZE,
                fill: color,
                x: x,
                y: y,
            }
            break;
        case 'text':
            obj.property = {
                text: DEFAULTS.TEXT.CONTENT,
                fontSize: DEFAULTS.TEXT.FONTSIZE,
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
    console.log(obj)
    return obj;
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//const baseState = {
    //     selected: null,
    //     objs: {},
    // };
    
    // export const useObjs = createStore(() => {
    //     const initialState = JSON.parse(localStorage.getItem('board'));
      
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