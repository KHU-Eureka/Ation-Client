import React, { useEffect, useState } from 'react';

import slide from '../../assets/svg/slide.svg';
import slide_current from '../../assets/svg/slide_current.svg';
import next from '../../assets/svg/slide_next.svg';
import prev from '../../assets/svg/slide_prev.svg';

const slideBtnStyle = {
    display: 'flex',
    cursor: 'pointer',
}

export function SlideCurrentDisplay(props) {
    const { isCurrent } = props;
    return(
        <div style={{marginLeft: '8px'}}>
        {isCurrent?<img src={slide_current} />:<img src={slide} />}
        </div>
    );
}

export function SlideBtn(props) {
    const { slideList, slideWidth, slideMargin, setIdx, idx } = props;
    const slideNum = slideList.length;

    const movingSlide = (num) => {
        if(slideList !== []) {
            props.children.ref.current.querySelector('.slidebox-container').style.left = (-num * ( slideWidth + slideMargin )) + 'px';
            setIdx(num);
        }
    }

    useEffect(() => {
        if(slideNum !== 0) {
            movingSlide(idx);
        }
    }, [idx])

    const prevClickHandler = () => {
        if (idx > 0) setIdx(idx - 1);
    }

    const nextClickHandler = () => {
        if (idx < slideNum - 1) setIdx(idx + 1);
    }

    return(
        <>
        <div className='slideBtn-container' style={slideBtnStyle}>
            <img src={prev} onClick={prevClickHandler} />
                {props.children}
            <img src={next} onClick={nextClickHandler} />
        </div>
        </>
    );
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


 // const slidebox = document.querySelector('.slidebox-container'); 
    // const [slideboxList, setSlideboxList] = useState();

    // useEffect(() => {
    //     if(props.children.ref.current.querySelector('.imgbox-container') !== undefined) {
    //         setSlideboxList(props.children.ref.current.querySelectorAll('.imgbox-container'));
    //         console.log(slideboxList.length)
    //     }
    // }, [slideboxList])
    // const slideboxList = props.children.ref.current.querySelectorAll('.slidebox-container');
    // const slideboxNum = slideboxList.length;
    // const slideWidth = 813;
    // const slideMargin = 16;
    
    //const [currentIdx, setCurrentIdx] = useState(0);

    // useEffect( () => {
    //     console.log(slidebox)
    //     if(slidebox !== null) {
    //         slidebox.style.width = (slideWidth + slideMargin) * slideboxNum + 'px';
    //     }
    // }, [slidebox])

    // useEffect(() => {
    //     if(props.children !== null) {
    //         const slidebox = document.querySelector('.slidebox-container'); 
    //         const slideboxList = document.querySelectorAll('.slidebox-container');
    //         const slideboxNum = slideboxList.length;
    //         const slideWidth = 813;
    //         const slideMargin = 16;
    //         let currentIdx = 0; 
    //     }
    // }, [props])