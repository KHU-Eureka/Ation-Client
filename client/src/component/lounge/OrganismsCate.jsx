import React, { useState, useEffect } from "react";

import { useFetch, clickUIPrevHandler, clickUIChangeHandler } from '../state';
import OrganismsList from "./OrganismsList";

function OrganismsCate() {
    const category = useFetch(`${process.env.REACT_APP_SERVER_HOST}/api/category/main`);
    const [loungeCategory, setLoungeCategory] = useState("전체");

    //***클릭 디자인
    const categoryStyle = {
        color: '#807A74',
        border: 'none',
    };
    const categoryStyle_click = {
        color: '#FE3400',
        borderBottom: '2px solid #FE3400'
    }
    //***클릭 디자인

    const categoryClickHandler = ( {target} ) => {
        setLoungeCategory(target.innerHTML);

        const categoryElems = document.querySelectorAll('.category');
        clickUIPrevHandler(categoryStyle, categoryElems);
        clickUIChangeHandler(categoryStyle_click, target);
    }

    const scrollHandler = ( {target} ) => {
        const scroll = parseInt(target.scrollingElement.scrollTop);
        const loungeRecentElem = document.querySelector('.OrganismsCate-Container');
        if(scroll > 680) {
            console.log(loungeRecentElem.style)
            loungeRecentElem.style.position = 'fixed';
            loungeRecentElem.style.top = '55px';
            loungeRecentElem.style.zIndex = '99';
            loungeRecentElem.style.paddingTop = '30px';
            loungeRecentElem.style.paddingBottom = '30px';
            loungeRecentElem.style.width = '100%';
        } else {
            loungeRecentElem.style.position = 'static';
            loungeRecentElem.style.zIndex = '0';
            loungeRecentElem.style.paddingTop = '0px';
            loungeRecentElem.style.paddingBottom = '0px';
        }
    }

    useEffect((e) => {
        window.addEventListener('scroll', scrollHandler);
        return () => window.removeEventListener('scroll', scrollHandler);
    }, [])

    return (
        <>
        {category !== undefined?
        <div className="OrganismsCate-Container">
            <span className="category" onClick={categoryClickHandler} style={categoryStyle_click}>전체</span>
            {category.map( cate => 
            <span className="category" key={cate.id} id={cate.id} onClick={categoryClickHandler}>
                {cate.name}
            </span>
            )}
        </div>:<></>}
        <OrganismsList category={loungeCategory} />
        </>
    )
}

export default OrganismsCate;