import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";

import NonGraphic from "../views/NonGraphic";
import { getApi } from '../state';
import { ImgBox } from './atoms';
import { DEFAULT_BG_STYLE } from './atomStyleSheet';

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
        categoryLoungeList.length!==0?
        <div className="OrganismsList-Container" style={{width: '1400px', height: '100%', marginTop: '36px'}}>
            {categoryLoungeList.map( lounge => 
            <>
                {lounge.status !== 'END'?<ImgBox obj={lounge} isPin={true}/>:null}
            </>)}
       </div>:
       <div className="OrganismsList-Container" style={{...DEFAULT_BG_STYLE, width: '612px', height: '346px', marginTop: '36px'}}>
            <div style={{marginTop: '73px'}}>
                <NonGraphic type={'lounge'} isImg={true} mainText={'오픈된 라운지가 '} subContent={{type: ''}} />
            </div>
        </div>
        :null}
        </>
    )
}

export default OrganismsList;