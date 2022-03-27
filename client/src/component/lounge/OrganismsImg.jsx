import { useEffect, useRef, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { SlideBtn, SlideCurrentDisplay } from '../views/SlideBtn';
import { getApi } from '../state';
import { imgBox, defaultText } from './atoms';
import { DEFAULT_BG_STYLE } from "./atomStyleSheet";

import NonGraphic from '../views/NonGraphic';

function OrganismsImg() {
    const waitImgRef = useRef();
    //채연-라운지 대기 누르면 dispatch({type: 'LOUNGE_WAIT', data: `wait ${response.data}`})
    const wait = useSelector((state) => state.loungeWait);
    const [loungeList, setLoungeList] = useState();
    const [slideList, setSlideList] = useState([]);
    const [idx, setIdx] = useState(0);

    useMemo(() => {
        getApi(`${process.env.REACT_APP_SERVER_HOST}/api/lounge/wait`).then((data) => setLoungeList(data.data.slice(0, 3)));
    }, [wait])

    useEffect(() => {
        if(document.querySelector('.slidebox-container div.imgbox-container')) {
            const slideContentsDoc = document.querySelectorAll('.slidebox-container div.imgbox-container');
            setSlideList(slideContentsDoc);
        }
    }, [loungeList])

    return (
        <>
        {loungeList !== undefined?
        loungeList.length !== 0?
        <>
        <SlideBtn slideList={slideList} slideWidth={813} slideMargin={36} setIdx={setIdx} idx={idx}>
        <div ref={waitImgRef} className="OrganismsImg-Container" style={{background: 'transparent', width: '813px', height: '400px', paddingLeft: '18px', paddingRight: '18px', paddingBottom: '12px'}}>
            <div className="slidebox-container" style={{width: `${849 * slideList.length}px`}}>
                {loungeList.map( lounge => 
                <>
                    {imgBox(lounge.lounge)}
                </>    
                )}
            </div>
        </div>
        </SlideBtn>
        <div style={{display: 'flex', justifyContent: 'flex-end', width: '831px'}}>
        {loungeList.map((contents, index) => <SlideCurrentDisplay isCurrent={index === idx}/>)}
        </div>
        </>
        :
        <div ref={waitImgRef} className="OrganismsImg-Container" style={{...DEFAULT_BG_STYLE, width: '813px', height: '400px', paddingLeft: '18px', paddingRight: '18px', paddingBottom: '12px'}}>
            <NonGraphic type={'lounge'} isImg={true} mainText={defaultText} subContent={{type: 'text', content: '라운지에 참여해 소통을 시작하세요 :)'}}/> 
        </div>
        :<></>}
        </>
    );
}

export default OrganismsImg;