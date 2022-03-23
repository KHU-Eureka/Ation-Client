import React from 'react';

import Pen from './Pen';
import Shape from './Shape';
import Letter from './Letter';
import Postit from './Postit';
import Image from './Image';
import Pin from './Pin';

export default function Elements(props) {
    const {type, isSelected, onSelect, setIsEditing, mode, obj, onChange, text, setText} = props;

    switch(type) {
        case 'pen':
            return(<Pen isSelected={isSelected} penObj={obj} mode={mode} setIsEditing={setIsEditing} onSelect={onSelect} onChange={onChange} />);
        case 'shape':
            return(<Shape isSelected={isSelected} shapeObj={obj} mode={mode} setIsEditing={setIsEditing} onSelect={onSelect} onChange={onChange}/>);
        case 'text':
            return(<Letter isSelected={isSelected} textObj={obj} mode={mode} setIsEditing={setIsEditing} onSelect={onSelect} onChange={onChange} text={text} setText={setText} />);
        case 'postit':
            return(<Postit isSelected={isSelected} postObj={obj} mode={mode} setIsEditing={setIsEditing} onSelect={onSelect} onChange={onChange}/>);
        case 'image':
            return(<Image isSelected={isSelected} imgObj={obj} mode={mode} setIsEditing={setIsEditing} onSelect={onSelect} onChange={onChange}/>);
        case 'pin':
            return(<Pin isSelected={isSelected} pinObj={obj} mode={mode} setIsEditing={setIsEditing} onSelect={onSelect} onChange={onChange}/>);
        default:
            return(<></>);
        }
}