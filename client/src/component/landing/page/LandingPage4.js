import { useSelector } from 'react-redux';
import persona1 from '../../../assets/image/persona1.png';
import persona2 from '../../../assets/image/persona2.png';
import persona3 from '../../../assets/image/persona3.png';

function LandingPage4 () {
    const senseInfoList = useSelector(state=>state.senseInfoList);

    return (
        <div className="page4">
            <div className="big-title">Make your persona</div>
            <div className="title-description">
                팀 에서도 어떤 역할을 맡는지에 따라 나의 성격과 능력의 감각은 달라지기 마련이에요. <br/>
                여러분들의 페르소나를 활용해 자유롭게 소통해보세요!
            </div>
            <div className="persona-wrapper">
                {
                    senseInfoList.map((sense, idx) => (
                        <div className="sense-elem" id={sense.name}>{sense.svg}</div>
                    ))
                }
                <img src={persona1} alt="persona"/>
                <img src={persona2} alt="persona"/>
                <img src={persona3} alt="persona"/>
            </div>
        </div>
    )
}
export default LandingPage4;