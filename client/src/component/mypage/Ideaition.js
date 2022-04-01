import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Cookies } from "react-cookie";
import axios from "axios";

import { SlideBtn } from "../views/SlideBtn";
import { useFetch } from '../state';
import '../../assets/css/ideation/ideation.scss';
import plus from '../../assets/svg/idea_plus.svg';

function Ideaition() {
    const navigation = useNavigate();
    const cookies = new Cookies();
    const ideationRef = useRef();
    const activePersonaId = useSelector((state) => state.activePersonaId);
    const ideations = useFetch(`${process.env.REACT_APP_SERVER_HOST}/api/ideation?personaId=${activePersonaId}`);
    const [slideList, setSlideList] = useState([]);
    const [idx, setIdx] = useState(0);

    const ideationAddHandler = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${process.env.REACT_APP_SERVER_HOST}/api/ideation`, 
            {
                "personaId": activePersonaId,
                "title": ideations.length!==0?`아이디어${ideations[ideations.length - 1].id+1}`:`첫번째 아이디어`,
                "whiteboard": "[]"
            }, 
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );
        navigation('/whiteboard', {state: { ideationId: String(response.data) }});
    }

    const ideationClickHandler = ({ target }) => {
        navigation('/whiteboard', {state: { ideationId: target.getAttribute('id') }});
    }

    useEffect(() => {
        if(document.querySelector('.slide-content')) {
            const slideDoc = document.querySelectorAll('.slide-content');
            let temp = [];
            let i = 1;
            while(i <= slideDoc.length) {
                if(i === 1 || i % 11 === 0) {
                    temp.push(slideDoc[i]);
                }
                i++;
            }
            setSlideList(temp);
        }
    }, [ideations])

    return(
        <>
        {ideations !== undefined?
        <div className="Ideataion-Container">
            <div className="title-container">
                My Ideation
            </div>
            {ideations.length < 10?
            <div className="ideataion-container">
                {ideations.length !== 0?
                ideations.map( i => <img className="ideation" id={i.id} onClick={ideationClickHandler} src={i.imgPath} width="20" height={20}/>):null }
                <img className="plus" src={plus} onClick={ideationAddHandler}/>
            </div>
            :
            <div className="slide-ideation-container">
            <SlideBtn slideList={slideList} slideWidth={1240.66} slideMargin={20} setIdx={setIdx} idx={idx}>
                <div className="slide-container" ref={ideationRef}>
                    <div className="slidebox-container" style={{width: `${1240.66 * slideList.length}px`}}>
                        { ideations.map( i => <div className="slide-content"><img className="ideation" id={i.id} onClick={ideationClickHandler} src={i.imgPath} width="20" height={20}/></div>) }
                        <div className="slide-content"><img className="plus" src={plus} onClick={ideationAddHandler}/></div>
                    </div>
                </div>
            </SlideBtn>
            </div>}
        </div>
        :<></>}
        </>
    );
}

export default Ideaition;