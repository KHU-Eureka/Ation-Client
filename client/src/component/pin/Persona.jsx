import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Cookies } from 'react-cookie';

function Persona() {
    const cookies = new Cookies();
    const dispatch = useDispatch();
    const activePersonaId = useSelector((state) => state.activePersonaId);

    const [clickedPersonaId, setClickedPersonaId] = useState(0);
    const [personas, setPersonas] = useState([]);

    //persona list import 관련 ...
    const personaSettingHandler = async () => {
        try {
            const token = cookies.get('token');
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_HOST}/api/persona/`, 
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                });
            for(var i of response.data) {
                if(i.id === activePersonaId) setPersonas([i]);
            }
            for(var i of response.data) {
                if(i.id !== activePersonaId) setPersonas( prev => [...prev, i] );
            }
        } 
        catch(error) {
            console.log(error);
        }
        setClickedPersonaId(activePersonaId);
    }

    useEffect(() => {
        personaSettingHandler();
    }, [])
    //...persona list import 관련

    //persona click 관련 ...
    const personaStyleHandler = () => {
        const personaList = document.querySelectorAll('.persona-img');
        for(var i=0;i<personaList.length;i++) {
            if(parseInt(personaList[i].getAttribute('id')) === clickedPersonaId) {
                personaList[i].style.border="1px solid #FE3400";
            } else {
                personaList[i].style.border="0";
            }
        }
    }

    const personaClickHandler = ({ target }) => {
        setClickedPersonaId(parseInt(target.getAttribute('id')));
        personaStyleHandler();
    }

    useEffect(() => {
        dispatch({type: 'CLICKED_PERSONA', data: clickedPersonaId});
        personaStyleHandler();
    }, [clickedPersonaId])
    //...persona click 관련

    return (
        <div className='persona-container'>
            {personas.map( (persona, i) => <img className='persona-img' key={i} id={persona.id} src={persona.profileImgPath} width='33px' height='33px' onClick={personaClickHandler} />)}
        </div>
    );
}

export default Persona;