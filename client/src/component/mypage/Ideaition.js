import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Cookies } from "react-cookie";
import axios from "axios";

import { useFetch } from '../state';
import '../../assets/css/ideation/ideation.scss';
import plus from '../../assets/svg/idea_plus.svg';

function Ideaition() {
    const navigation = useNavigate();
    const cookies = new Cookies();
    const activePersonaId = useSelector((state) => state.activePersonaId);
    const ideations = useFetch(`${process.env.REACT_APP_SERVER_HOST}/api/ideation?personaId=${activePersonaId}`);

    const ideationAddHandler = async () => {
        const token = cookies.get('token');
        const response = await axios.post(`${process.env.REACT_APP_SERVER_HOST}/api/ideation`, 
            {
                "personaId": activePersonaId,
                "title": `아이디어${ideations.length+1}`,
                "whiteboard": "[]"
            }, 
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );
        navigation('/whiteboard', {state: { ideationId: response.data }});
    }

    const ideationClickHandler = ({ target }) => {
        navigation('/whiteboard', {state: { ideationId: parseInt(target.getAttribute('id')) }});
    }

    return(
        <>
        {ideations !== undefined?
        <div className="Ideataion-Container">
            <div className="title-container">
                My Ideation
            </div>
            <div className="ideataion-container">
                {ideations.length === 0?
                <></>:
                ideations.map( i => <img className="ideation" id={i.id} onClick={ideationClickHandler} src={i.imgPath} width="20" height={20}/>) }
                <img className="plus" src={plus} onClick={ideationAddHandler}/>
            </div>
        </div>
        :<></>}
        </>
    );
}

export default Ideaition;