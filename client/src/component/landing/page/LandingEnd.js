import { ReactComponent as AtionRed } from '../../../assets/svg/-ation_red.svg';
import './LandingEnd.css';

function LandingEnd() {
    const linkList = [
        { name: '제휴 및 마케팅 문의', link: '' },
        { name: '개인정보 처리방침', link: '' },
        { name: '이용약관', link: '' },
        { name: '피드백', link: '' },
    ]

    return (
        <div className="landing-end">
            <div className="title">Get inspiration, to ideation.</div>
            <button className="lets-ation">
                Let's ation!
            </button>
            <div className="footer">
                <div className="fill">
                    fill in the <AtionRed/> idea blank
                </div>
                <div className="link-wrapper">
                    {
                        linkList.map((link, idx)=> (
                            <a className="link-elem" href={link.link}>
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