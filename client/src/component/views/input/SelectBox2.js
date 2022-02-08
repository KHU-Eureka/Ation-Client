import React, { useState, useEffect, useRef } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import '../../../assets/css/input/SelectBox.css';

// select option이 id와 value로 이루어진 경우
// option {id, value}
function SelectBox2(props) {
    // props 종류
    // 1) selectedValue : 선택된 값(id값) / 2) defaultValue : 기본값(id값) / 3) optionList : 값들의 목록
    // 4) setValue : 값 변경 함수
    const ref = useRef();
    let [active, setActive] = useState(false);

    const activeOptions = () => {
        setActive(!active)
    }

    const changeValue = (option) => {
        props.setValue(option)
        setActive(false)
    }

    const clickOutside = (e) => {
        if (!ref.current.contains(e.target)) {
            setActive(false);
        }
    }

    useEffect(()=> {
        document.addEventListener('mousedown', clickOutside)
        return () => {
            document.removeEventListener('mousedown', clickOutside)
        }
    }, [])

    return (
        <div className="select-box" ref={ref}>
            <div 
            className={active ? "select-value active" : "select-value"}
            onClick={activeOptions}>
                { /* 미리 선택되었던 값이 있다면,, */
                props.selectedValue
                ? <span>{ props.optionList.filter(item => item.id === props.selectedValue)[0].value }</span>
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
                            id={props.selectedValue && props.selectedValue === optionItem.id ? "selected-item" : null}
                            onClick={()=>{changeValue(optionItem.id)}}>
                                { optionItem.value }
                            </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
        
    )
}

export default SelectBox2;