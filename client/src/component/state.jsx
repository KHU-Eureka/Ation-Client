import React, { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import pin from '../assets/svg/pin.svg';

export function useFetch(url, deps) { 
    const [data, setData] = useState(); 

    useEffect( async () => { 
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: "Bearer " + token
                }
            });
            setData(response.data);
        } catch(err) {
            console.log(err);
        }
        return () => {
            
        }
    }, [url, deps]);

    return data; 
}

export async function getApi(url) {
    const cookies = new Cookies();
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        return response;
    } catch(err) {
        console.log(err);
    }
    return;
}

export function LoungePinup(props) {
    const dispatch = useDispatch();
    const { loungeId } = props;

    const pinClickHandler = async () => {
        const cookies = new Cookies();
        const token = localStorage.getItem('token');
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_HOST}/api/lounge/pin/${loungeId}`, {}, {
                headers: {
                    Authorization: "Bearer " + token
                }
            });
            dispatch({type: 'LOUNGE_PINUP', data: `pinup ${response.data}`})
        } catch(err) {
            console.log(err.message);
        }
    }
    

    return(
        <img className='pin' src={pin} onClick={pinClickHandler}/>
    );

}

export async function enterLounge(target, loungeId, personaId) {
    if(target.className !== 'pin') {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`${process.env.REACT_APP_SERVER_HOST}/api/lounge/${loungeId}/enter/${personaId}`, {}, {
                headers: {
                    Authorization: "Bearer " + token
                }
            });
            console.log("response: ", response);
            window.location.replace(`/lounge-room/${loungeId}`);
        } catch(err) {
            // window.location.replace(`/lounge-room/${loungeId}`);
        }
    }
}

export function clickUIPrevHandler(prevStyle, prevElems) {
    for(let i of prevElems) {
        for(let key in prevStyle) i.style[key] = prevStyle[key];
    }
}

export function clickUIChangeHandler(changeStyle, currentTarget) {
    for(let key in changeStyle) currentTarget.style[key] = changeStyle[key];
}

export function clickClassListPrevHandler(prevClass, prevElems) {
    for(let i of prevElems) i.classList.remove(prevClass);
}

export async function deleteHandler(url, id) {
    try { 
        const cookies = new Cookies();
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${process.env.REACT_APP_SERVER_HOST}/api/${url}/${id}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        return response;
    } catch(err) { 
        console.log(err);
    }
    return;
}

// export function lazyImageHandler(nameOfClass) {
//     const target = Array.from(document.querySelectorAll(nameOfClass));

//     function callback(items, observer) {
//         items.forEach(item => {
//             const fullImg = item.target.querySelector()
//         })
//     }
// }