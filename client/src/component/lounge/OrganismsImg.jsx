import { useEffect } from "react";
import { useDispatch } from "react-redux";

function OrganismsImg() {
    const dispatch = useDispatch();

    useEffect(()=> {
        dispatch({type: 'MENU', data: 'lounge'});
    }, [])

    return (
        <div className="lounge" style={{background: 'pink', width: '879px', height: '466px'}}>
            
        </div>
    )
}

export default OrganismsImg;