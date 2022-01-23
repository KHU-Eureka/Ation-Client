import React, { useState } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import './SelectBox.css';

function SelectBox(props) {
    // props 종류
    // 1) selectedValue : 선택된 값 / 2) defaultValue : 기본값(text) / 3) optionList : 값들의 목록
    // 4) setValue : 값 변경 함수

    let [active, setActive] = useState(false);

    const activeOptions = () => {
        setActive(!active)
    }

    const changeValue = (option) => {
        props.setValue(option)
        setActive(false)
    }

    return (
        <div className="select-box">
            <div 
            className={active ? "select-value active" : "select-value"}
            onClick={activeOptions}>
                { /* 미리 선택되었던 값이 있다면,, */
                props.selectedValue
                ? <span>{ props.selectedValue }</span>
                : <span className="default-text">{ props.defaultValue }</span>
                }
                <span className="down-icon"><AiFillCaretDown /></span>
            </div>
            <div 
            className="option-wrapper">
                <div className="option-list">
                    {
                        props.optionList && props.optionList.map(function(optionItem, idx) {
                            return (
                            <div 
                            key={idx}
                            className="option-item" 
                            id={props.selectedValue && props.selectedValue === optionItem ? "selected-item" : null}
                            onClick={()=>{changeValue(optionItem)}}>
                                { optionItem }
                            </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
        
    )
}

export default SelectBox;