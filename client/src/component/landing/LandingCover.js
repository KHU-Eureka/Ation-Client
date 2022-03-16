import { ReactComponent as Ation } from '../../assets/svg/-ation.svg';
import { ReactComponent as Slot } from '../../assets/svg/slot.svg';
import './LandingCover.css';

function LandingCover() {
    const wordList = [ 'sense', 'inspir', 'convers', 'innov', 'cre', 'sense', 'inspir', 'convers', 'innov', 'cre', 'sense', 'inspir', 'convers', 'innov', 'cre' ];

    return(
        <div className="landing-cover">
            <div className="title">창작이 시작되는 순간, 에이션.</div>
            <div className="slot-container">
                <span>Let's</span>
                <div className="options-container">
                    <div className="shadow"></div>
                    <div className="options-wrapper">
                        {
                            wordList.map((word, idx)=> (
                                <div className="option">{word}</div>
                            ))
                        }
                    </div>
                </div>
                <span>ation</span>
                <div className="slot-wrapper">
                <Slot className="slot"/>
                    <span>Pull this slot</span>
                </div>
            </div>
            <Ation className="-ation"/>
        </div>
    )
}
export default LandingCover;