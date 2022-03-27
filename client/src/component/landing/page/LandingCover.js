import { useEffect, useRef, useState } from 'react';
import { ReactComponent as Ation } from '../../../assets/svg/-ation.svg';
import { ReactComponent as Slot } from '../../../assets/svg/slot.svg';
import './LandingCover.css';

function LandingCover() {
    const wordList = [ 'sens', 'inspir', 'convers', 'innov', 'cre', 'sens', 'inspir', 'convers', 'innov', 'cre', 'sens', 'inspir', 'convers', 'innov', 'cre' ];
    const slot = useRef();
    const rullet = useRef();
    const timer = useRef(null);
    const time = useRef(3);
    const [sec, setSec] = useState(3);
    let [pullSlot, setPullSlot] = useState(false);

    const removeAnimation = () => {
        slot.current.classList.remove('pull-slot');
        rullet.current.classList.remove('roll-rullet');
        document.activeElement.blur();
    }
    const rollTheRullet = () => {
        slot.current.classList.add('pull-slot');
        rullet.current.classList.add('roll-rullet');
        setPullSlot(true);
    }
    const removeRulletAnimation = () => {
        slot.current.classList.remove('pull-slot');
        rullet.current.classList.remove('roll-rullet');
        setPullSlot(false);
    }

    useEffect(()=> {
        slot.current.addEventListener('load', removeAnimation);
        slot.current.addEventListener('focus', rollTheRullet);
        slot.current.addEventListener('blur', removeRulletAnimation);
    }, [])

    useEffect(()=> {
        if (pullSlot) { 
            setSec(3); time.current = 3;
        }
        timer.current = setInterval(()=>{
            if (pullSlot) {
                setSec(time.current);
                time.current -= 1;
                console.log(time.current);
            }
        }, 1000)
        return () => clearInterval(timer.current)
    }, [pullSlot])

    useEffect(()=> {
        if (time.current <= 0) { // 3초가 모두 지난다면
            console.log('time out');
            clearInterval(timer.current)
            document.activeElement.blur();
        }
    }, [time.current])

    return(
        <div className="landing-cover sa">
            <div className="title">창작이 시작되는 순간, 에이션.</div>
            <div className="slot-container">
                <span>Let's</span>
                <div className="options-container">
                    <div className="shadow"></div>
                    <div className="options-wrapper roll-rullet" ref={rullet}>
                        {
                            wordList.map((word, idx)=> (
                                <div className="option" key={idx}>{word}</div>
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