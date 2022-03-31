import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BiChevronDown } from 'react-icons/bi';

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

export default function IdeationTitle(props) {
    const { ChangeTitle, setChangeTitle } = props;
    const { state } = useLocation();
    const [title, setTitle] = useState();
    const [openOptionTitle, setOpenOptionTitle] = useState(false);

    useEffect(() => {
        getApi(`${process.env.REACT_APP_SERVER_HOST}/api/ideation/${state.ideationId}`).then((data) => setTitle(data.data.title));
    }, [state, ChangeTitle])


    const selectBtnClickHandler = () => {
        setOpenOptionTitle(true);
    }

    return(
        <div className='IdeationTitle-container' style={IdeationStyle}>
            {ideationTitle(title)}
            <BiChevronDown className="down-icon" onClick={selectBtnClickHandler}/>
            {openOptionTitle && <OptionTitle setOpenOptionTitle={setOpenOptionTitle} setChangeTitle={setChangeTitle} ChangeTitle={ChangeTitle}/>}
        </div>
    );
}