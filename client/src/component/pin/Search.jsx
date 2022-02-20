import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Cookies } from 'react-cookie';

function Search(props) {
    const { setPins } = props;
    const cookies = new Cookies();
    const clickedPersonId = useSelector((state) => state.clickedPersonId);

    const [searchInput, setSearchInput] = useState('');

    const searchInputChangeHandler = ({ target }) => {
        setSearchInput(target.value);
    }

    const pinSearchHandler = async () => {
        const token = cookies.get('token');
        const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/pin/search?keyword=${searchInput}&personaId=${clickedPersonId}`, 
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            });
        setPins(response.data);
    }

    return (
        <div className='search-container'>
            <input value={searchInput} onChange={searchInputChangeHandler} onKeyPress={pinSearchHandler} placeholder="검색" />
        </div>
    );
}

export default Search;