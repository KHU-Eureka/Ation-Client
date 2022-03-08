import { useEffect, useRef } from "react";

import SlideBtn from '../views/SlideBtn';
import { useFetch } from '../state';
import { imgBox } from './atoms';

function OrganismsImg() {
    const loungeList = useFetch(`${process.env.REACT_APP_SERVER_HOST}/api/lounge/wait`);
    const waitImgRef = useRef();

    return (
        <>
        {loungeList !== undefined?
        <SlideBtn>
        <div ref={waitImgRef} className="OrganismsImg-Container" style={{background: 'pink', width: '813px', height: '400px', paddingLeft: '18px', paddingRight: '18px', paddingBottom: '12px'}}>
            <div className="slidebox-container">
                {loungeList.map( lounge => 
                <>
                    {imgBox(lounge.lounge)}
                </>    
                )}
            </div>
        </div>
        </SlideBtn>
        :<></>}
        </>
    );
}

export default OrganismsImg;