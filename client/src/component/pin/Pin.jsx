import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Cookies } from 'react-cookie';

import Search from './Search';

function Pin(props) {
    const { setPinObject } = props;

    const cookies = new Cookies();
    const clickedPersonId = useSelector((state) => state.clickedPersonId);

    const [pins, setPins] = useState([]);

    const pinSettingHandler = async () => {
        try {
            const token = cookies.get('token');
            const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/pin?personaId=${clickedPersonId}`,
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                });
            setPins(response.data);
        } 
        catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(clickedPersonId !== 0) {
            pinSettingHandler();
        }
    }, [clickedPersonId])

    const pinDragHandler = ({ target }) => {
        for(let pin of pins) {
            if(parseInt(target.getAttribute('id')) === pin.id) {
                setPinObject(pin);
            }
        }
    }

    return (
        <>
        <Search setPins={setPins} />
        <div className='pin-container'>
            {pins.map( (pin, i) => 
            <>
                <div className='pin-image'>
                    <img draggable="true" onDragStart={pinDragHandler} key={i} id={pin.id} src={pin.pinImgPath} width='154px' height='87px' />
                </div>
                <div className='pin-title'>
                    <span>{pin.insight.title}</span>
                </div>
                <div className='pin-site'>
                    <img src={pin.insight.icon} />
                    <span>{pin.insight.siteName}</span>
                </div>
            </>
            )}
        </div>
        </>
    );
}

export default Pin;