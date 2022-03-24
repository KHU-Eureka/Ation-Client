import { useEffect, useRef } from 'react';
import { ReactComponent as Ation } from '../../../assets/svg/-ation.svg';
import { ReactComponent as Slot } from '../../../assets/svg/slot.svg';
import './LandingCover.css';

function LandingCover() {
    const wordList = [ 'sens', 'inspir', 'convers', 'innov', 'cre', 'sens', 'inspir', 'convers', 'innov', 'cre', 'sens', 'inspir', 'convers', 'innov', 'cre' ];
    const slot = useRef();
    const rullet = useRef();

    const pullTheSlot = () => {
        slot.current.classList.add('pull-slot');
    }
    const removeAnimation = () => {
        slot.current.classList.remove('pull-slot');
        rullet.current.classList.remove('roll-rullet');
    }
    const rollTheRullet = () => {
        slot.current.classList.add('pull-slot');
        rullet.current.classList.add('roll-rullet');
    }
    const removeRulletAnimation = () => {
        slot.current.classList.remove('pull-slot');
        rullet.current.classList.remove('roll-rullet');
    }

    useEffect(()=> {
        slot.current.addEventListener('load', removeAnimation);
        slot.current.addEventListener('focus', rollTheRullet);
        slot.current.addEventListener('blur', removeRulletAnimation);
        
    }, [])
    

    return(
        <div className="landing-cover sa">
            <div className="title sa sa-up">창작이 시작되는 순간, 에이션.</div>
            <div className="slot-container">
                <span>Let's</span>
                <div className="options-container">
                    <div className="shadow"></div>
                    <div className="options-wrapper roll-rullet" ref={rullet}>
                        {
                            wordList.map((word, idx)=> (
                                <div className="option">{word}</div>
                            ))
                        }
                    </div>
                </div>
                <span>ation</span>
                <div className="slot-wrapper">
                    <button className="slot pull-slot" ref={slot}>
                        <Slot/>
                    </button>
                    <div className="text">Pull this slot</div>
                </div>
            </div>
            <Ation className="-ation"/>
        </div>
    )
}
export default LandingCover;