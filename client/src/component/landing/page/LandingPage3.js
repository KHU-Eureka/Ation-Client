import { useSelector } from "react-redux";

function LandingPage3() {
    const senseInfoList = useSelector(state=>state.senseInfoList);

    return (
        <div className="page3">
            <div className="small-title">Our mission</div>
            <div className="big-title">Develop your sense</div>
            <div className="title-description">
                우리는 여러분들의 능력을 ‘감각’으로 표현해요. <br/>
                사람들과 소통하고 협업하기 위해 필요한 5가지의 감각을 발전시킬 수 있는 기회를 제공합니다.
            </div>
            <div className="sense-wrapper">
                {
                    senseInfoList && senseInfoList.map((sense, idx)=> (
                        <div className="sense-elem">{sense.svg}</div>
                    ))
                }
                {
                    senseInfoList && senseInfoList.map((sense, idx)=> (
                        <div className="sense-elem">{sense.svg}</div>
                    ))
                }
                {
                    senseInfoList && senseInfoList.map((sense, idx)=> (
                        <div className="sense-elem">{sense.svg}</div>
                    ))
                }
            </div>
        </div>
    )
}
export default LandingPage3;