import { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';

export function useFetch(url) { 
    const cookies = new Cookies();
    const [data, setData] = useState(); 

    useEffect( async () => { 
        const token = cookies.get('token');
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            setData(response.data);
        } catch(err) {
            console.log(err);
        }
    }, [url]);

    return data; 
}