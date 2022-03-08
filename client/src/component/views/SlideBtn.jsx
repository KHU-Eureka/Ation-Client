import React, { useEffect, useState } from 'react';

import next from '../../assets/svg/slide_next.svg';
import prev from '../../assets/svg/slide_prev.svg';

const slideBtnStyle = {
    display: 'flex',
}

export default function SlideBtn(props) {
    // const slidebox = document.querySelector('.slidebox-container'); 
    // const slideboxList = document.querySelectorAll('.slidebox-container');
    // const slideboxNum = slideboxList.length;
    // const slideWidth = 813;
    // const slideMargin = 16;
    let currentIdx = 0; 
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


    const movingSlide = (num) => {
        if(props.children.ref.current.querySelector('.slidebox-container') !== null) {
            props.children.ref.current.querySelector('.slidebox-container').style.left = (-num * (813+36)) + 'px';
            // setCurrentIdx(num);
            currentIdx = num;
        }
    }

    const prevClickHandler = () => {
        if (currentIdx !== 0) {
            movingSlide(currentIdx - 1);
        }
    }

    const nextClickHandler = () => {
        if (currentIdx !== 4) { 
            movingSlide(currentIdx + 1); 
        }
    }

    return(
        <div className='slideBtn-container' style={slideBtnStyle}>
            <img src={prev} onClick={prevClickHandler} />
                {props.children}
            <img src={next} onClick={nextClickHandler} />
        </div>
    );
}