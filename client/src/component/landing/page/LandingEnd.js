import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Login from '../../login/Login';
import { ReactComponent as AtionRed } from '../../../assets/svg/-ation_red.svg';
import './LandingEnd.css';

function LandingEnd() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector(state=>state.auth);
    const linkList = [
        { name: '제휴 및 마케팅 문의', link: '' },
        { name: '개인정보 처리방침', link: '' },
        { name: '이용약관', link: '' },
        { name: '피드백', link: '' },
    ]
    let [showLoginModal, setShowLoginModal] = useState(false);

    const ationClickHandler = () => {
        if (auth) {
            navigate('/insight');
        } else {
            dispatch({type: 'LOGIN', data: true});
        }
    }

    return (
        <div className="landing-end">
            <div className="title sa sa-up" id="pageCoverTitle">Get inspiration, to ideation.</div>
            <button className="lets-ation sa sa-up" data-sa-trigger="#pageCoverTitle" data-sa-margin="600"
            onClick={()=>{ationClickHandler()}}>
                Let's ation!
            </button>
            <div className="footer">
                <div className="fill">
                    fill in the <AtionRed/> idea blank
                </div>
                <div className="link-wrapper">
                    {
                        linkList.map((link, idx)=> (
                            <a className="link-elem" href={link.link} key={idx}>
                                { link.name }
                            </a>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
export default LandingEnd;