import persona1 from '../../../assets/image/persona1.png';
import persona2 from '../../../assets/image/persona2.png';
import persona3 from '../../../assets/image/persona3.png';

function LandingPage2 () {
    const whoList = [
        { image: persona1, description: '떠오르는 가벼운 아이디어들을\n공유하고 발전 시켜보고 싶은 사람' },
        { image: persona2, description: '나와 비슷한 분야의 사람들과\n인사이트를 공유하고 싶은 사람' },
        { image: persona3, description: '사람들과 아이데이션 하며 나의\n감각을 발전시켜보고 싶은 사람' }
    ]

    return (
        <div className="page2">
            <div className="small-title">For who</div>
            <div className="who-wrapper">
                {
                    whoList.map((who, idx)=> (
                        <div className="who-card sa sa-up" data-sa-margin={(idx+1)*180} key={idx}>
                            <img src={who.image} alt="persona"/>
                            <div className="description">{ who.description }</div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
export default LandingPage2;