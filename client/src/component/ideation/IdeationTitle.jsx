import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import OptionTitle from './OptionTitle';

import { getApi } from '../state';
import { ideationTitle } from './atom';
import selectBtn from '../../assets/svg/slide_next.svg';

const IdeationStyle = {
    position: 'relative',
    marginTop: '41.5px',
    marginBottom: '-60px',
    display: 'flex',
    justifyContent: 'space-between',
    width: '234px',
    cursor: 'pointer',
}

export default function IdeationTitle() {
    const { state } = useLocation();
    const [title, setTitle] = useState();
    const [openOptionTitle, setOpenOptionTitle] = useState(false);

    useEffect(() => {
        getApi(`http://ation-server.seohyuni.com/api/ideation/{ideationId}?ideationId=${state.ideationId}`).then((data) => setTitle(data.data.title));
    }, [state])


    const selectBtnClickHandler = () => {
        setOpenOptionTitle(true);
    }

    return(
        <div className='IdeationTitle-container' style={IdeationStyle}>
            {ideationTitle(title)}
            <img onClick={selectBtnClickHandler} src={selectBtn} />
            <OptionTitle openOptionTitle={openOptionTitle} setOpenOptionTitle={setOpenOptionTitle}/>
        </div>
    );
}