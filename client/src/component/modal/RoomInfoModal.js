import { ReactComponent as BracketLeft } from '../../assets/svg/bracket_left.svg';
import { ReactComponent as BracketRight } from '../../assets/svg/bracket_right.svg';
import { ReactComponent as Crown } from '../../assets/svg/crown.svg';
import { ReactComponent as Pencil } from '../../assets/svg/pencil.svg';
import { VscChromeClose } from 'react-icons/vsc';
import { useSelector } from 'react-redux';
import './RoomInfoModal.css';

function RoomInfoModal (props) {
    const { roomInfo, isAdmin, admin, setShowModal, setShowRoomEditModal } = props;
    const senseInfoList = useSelector(state=>state.senseInfoList);
    
  const goToEdit = () => {
      setShowModal(false);
      setShowRoomEditModal(true);
  }

    return (
        <div className="room-info">
            <div className="modal-background">
                <div className="modal-wrapper">
                    <img className="room-img" src={roomInfo.imgPath} />

                    <VscChromeClose 
                        className="close-btn"
                        onClick={()=>{setShowModal(false)}}
                    />

                    <div className="modal-content">

                        {
                            isAdmin &&
                            <Pencil 
                                className="edit-btn"
                                onClick={()=>{goToEdit()}}
                            />
                        }

                        <div className="content-wrapper room-title">
                            <BracketLeft/>
                            <div>{roomInfo.title}</div>
                            <BracketRight/>
                        </div>

                        <div className="content-wrapper">
                            <div className="title">한 줄 소개</div>
                            <div className="content">{roomInfo.introduction}</div>
                        </div>

                        <div className="content-wrapper">
                            <div className="title"># 분야</div>
                            <div className="category-wrapper">
                                <div className="category-elem">
                                    { roomInfo.mainCategory.name }
                                </div>
                            </div>
                        </div>


                        <div className="content-wrapper">
                            <div className="title"># 중분류</div>
                            <div className="category-wrapper">
                                {
                                    roomInfo.subCategoryList && roomInfo.subCategoryList.map((category, idx)=> (
                                        <div className="category-elem">
                                            { category.name }
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="content-wrapper">
                            <div className="title">최대 인원</div>
                            <div className="content">
                                { roomInfo.limitMember
                                    ? <><span className="limit-num">{roomInfo.limitMember}명</span> <span className="is-limit">상시모집X</span></>
                                    : <span className="limit-num">상시모집</span>
                                
                                }
                            </div>
                        </div>
                        
                        <div className="content-wrapper">
                            <div className="title">선호 감각</div>
                            <div className="content">
                                {
                                    senseInfoList && 
                                    senseInfoList.find(elem=>roomInfo.sense.senseId===elem.id).svg
                                }
                            </div>
                        </div>
                        
                        <div className="content-wrapper admin">
                                <div className="title">방장</div>
                                <div className="admin-info">
                                    <img src={admin.profileImgPath}/>
                                    <div>{admin.nickname} <Crown className="crown"/></div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default RoomInfoModal;