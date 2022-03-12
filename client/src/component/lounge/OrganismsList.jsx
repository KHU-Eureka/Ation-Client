import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";

import { getApi } from '../state';
import { imgBox } from './atoms';

function OrganismsList(props) {
    //채연-라운지 추가 누르면 dispatch({type: 'LOUNGE_CREATE', data: `create ${response.data}`})
    const create = useSelector((state) => state.loungeCreate);
    const [loungeList, setLoungeList] = useState([]);
    const { category } = props;

    useEffect(() => {
        getApi(`${process.env.REACT_APP_SERVER_HOST}/api/lounge`).then((data) => setLoungeList(data.data));
    }, [create])

    const filterCategory = () => {
        if(loungeList !== undefined) {
            const categoryLounge = loungeList.filter(data => category!=="전체"? data.mainCategory.name === category:data===data);
            return categoryLounge;
        }
    }

    const categoryLoungeList = useMemo(filterCategory, [category, loungeList]);

    return (
        <>
        {categoryLoungeList !== undefined?
        <div className="OrganismsList-Container" style={{background: 'salmon', width: '1400px', height: '100%', marginTop: '36px'}}>
        {categoryLoungeList.map( lounge => 
        <>
            {lounge.status !== 'END'?imgBox(lounge, true):null}
        </>
        )}
        </div>
        :null}
        </>
    )
}

export default OrganismsList;