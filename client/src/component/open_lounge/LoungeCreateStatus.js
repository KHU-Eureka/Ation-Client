import { useNavigate } from 'react-router-dom';
import character from '../../assets/image/character.png';
import './LoungeCreateStatus.css';

function LoungeCreateStatus(props) {
    const navigation = useNavigate();
    const { waiting, success, loungeId, setShowModal } = props;

    const goToLounge = () => {
        navigation(`/lounge-room/${loungeId}`); // 라운지 방으로 이동
        setShowModal(false); // 모달창 닫기
    }

    return(
        <div className="lounge-status">
            <img src={character} alt="character"></img>
            {
                waiting
                ? <>
                <div className="title">라운지를 오픈하고 있습니다</div>
                <div className="subtitle">조금만 기다려주세요</div>
                <div className="waiting-circle">
                    <div></div>
                    <div></div>
                    <div></div>
                </div> </>
                : (
                    success
                    ? 
                    <>
                    <div className="title">라운지 생성에 성공했습니다</div>
                    <div className="subtitle">라운지로 가서 멤버들이 오기를 기다리세요!</div> 
                    <button className="modal-btn"
                        onClick={()=>{goToLounge()}}
                    >라운지로 바로가기</button>
                    </>
                    : 
                    <>
                    <div className="title">라운지 생성에 실패했습니다</div>
                    <div className="subtitle">다시 시도해주세요</div>
                    </>
                )
            }

        </div>
    )
}

export default LoungeCreateStatus;