import { Cookies } from 'react-cookie';
import axios from 'axios';

export const ideationTitlePost = (ideationId, title) => {
    const cookie = new Cookies();
    const token = cookie.get('token');

    try {
        const response = axios.put(`${process.env.REACT_APP_SERVER_HOST}/api/ideation/title/${ideationId}`, 
        {
            "title": title
        }, 
        {
            headers: {
                Authorization: "Bearer" + token
            }
        });
        return response;
    } catch(err) {
        console.log(err);
    }
    return;
}