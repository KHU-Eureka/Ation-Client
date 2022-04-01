import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { AttrContextStore } from './store/AttrContext';
import { mainTitle, ModuleBox } from './atom';
import { getApi } from '../state';

import '../../assets/css/ideation/LNB.scss';

const IDEATION_LIST = {
    marginTop: '106.62px',
}

function IdeationList(props) {
    const attrStore = useContext(AttrContextStore);
    const ChangeTitle = props.ChangeTitle;
    const activePersonaId = useSelector((state) => state.activePersonaId);
    const [ideationList, setIdeationList] = useState([]);
    const [deleteIdeation, setDeleteIdeation] = useState('');

    useEffect(() => {
        getApi(`${process.env.REACT_APP_SERVER_HOST}/api/ideation?personaId=${activePersonaId}`).then((data) => {setIdeationList(data.data);});
    }, [activePersonaId, ChangeTitle, attrStore.thumbnail, deleteIdeation])

    return(
        <div className='IdeationList-container' style={IDEATION_LIST}>
            {mainTitle('아이데이션 목록')}
            <div className='ideation-list'>
                <div className='ideation-list-wrap'>
                {ideationList !== undefined && ideationList.map( ideation => 
                    <>
                        <ModuleBox obj={ideation} setDeleteIdeation={setDeleteIdeation} />
                    </>    
                )}
                </div>
            </div>
        </div>
    );
}

export default IdeationList;