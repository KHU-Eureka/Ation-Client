import { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import 'url-search-params-polyfill';

export function useFetch(url, deps) { 
    const cookies = new Cookies();
    const [data, setData] = useState(); 

    useEffect( async () => { 
        const token = cookies.get('token');
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
            console.log('useEffect clean up')
        }
    }, [url, deps]);

    return data; 
}

export async function loungePinup(loungeId) {
    const cookies = new Cookies();
    const token = cookies.get('token');

    try {
        await axios.post(`${process.env.REACT_APP_SERVER_HOST}/api/lounge/pin/${loungeId}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
    } catch(err) {
        console.log(err);
    }
}