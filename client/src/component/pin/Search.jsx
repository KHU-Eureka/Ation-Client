import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Cookies } from 'react-cookie';

import search from '../../assets/svg/search.svg';

function Search(props) {
    const { setPins, pId } = props;
    const cookies = new Cookies();
    // const clickedPersonId = useSelector((state) => state.clickedPersonId);

    const [searchInput, setSearchInput] = useState('');

    const searchInputChangeHandler = ({ target }) => {
        setSearchInput(target.value);
    }

    const pinSearchHandler = async (e) => {
        if(e.code === 'Enter') {
            const token = cookies.get('token');
            const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/pin/search?keyword=${searchInput}&personaId=${pId}`, 
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                });
            setPins(response.data);
        }
    }

    return (
        <>
            <div className='Search-Container'>
                <input className='search' value={searchInput} onChange={searchInputChangeHandler} onKeyPress={pinSearchHandler} placeholder="검색" />
                <img src={search}/>
            </div>
        </>
    );
}

export default Search;