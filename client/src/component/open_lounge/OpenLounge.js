import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { IoChevronBack, IoClose } from 'react-icons/io5';
import Form01 from './createForm/Form01';
import Form02 from './createForm/Form02';
import Form03 from './createForm/Form03';
import Form04 from './createForm/Form04';
import LoungeCreateStatus from './LoungeCreateStatus';
import './OpenLounge.css';

function OpenLounge(props) {
    const dispatch = useDispatch();
    const modalInside = useRef();
    const activePersonaId = useSelector((state)=>state.activePersonaId)

    // lounge 생성 page
    let [page, setPage] = useState(1);
    let [formValidation, setFormValidation] = useState(false);

    // lounge 정보
    let [title, setTitle] = useState('');
    let [mainCategoryId, setMainCategoryId] = useState(null);
    let [subCategoryIdList, setSubCategoryIdList] = useState([]);
    let [limitMember, setLimitMember] = useState(1);
    let [isLimit, setIsLimit] = useState(true);
    let [senseId, setSenseId] = useState(null);
    let [introduction, setIntroduction] = useState('');
    let [imageId, setImageId] = useState(1);
    
    // lounge status 정보
    let [showStatus, setShowStatus] = useState(false);
    let [waiting, setWaiting] = useState(false); // 라운지 생성을 기다리고 있는가?
    let [success, setSuccess] = useState(false);
    let [loungeId, setLoungeId] = useState(null);

    const addWaitingRoom = (roomId) => {
        let waitingRoomInfo = { id: roomId, personaId: activePersonaId, title: title };
        dispatch({type: 'ADD_WAITING', data: waitingRoomInfo});
    }

    const clickOutside = (e) => {
        if (!modalInside.current.contains(e.target)) {
            props.setShowOpenLounge(false);
        }
    }

    const nextPage = () => {
        if (page === 1 && (mainCategoryId === 7 || mainCategoryId === 8)) // category가 YourView나, 기타일 땐 세부 카테고리 선택하지 않도록
            setPage(3);
        else setPage(page + 1);
        setFormValidation(false);
    }

    const backPage = () => {
        if (page === 3 && (mainCategoryId === 7 || mainCategoryId === 8)) // category가 YourView나, 기타일 땐 세부 카테고리 선택하지 않도록
            setPage(1);
        else if (page !== 1) setPage(page - 1);
    }

    useEffect(()=>{
        document.addEventListener('mousedown', clickOutside);
        return (()=> {
            document.removeEventListener('mousedown', clickOutside);
        })
    }, [])

    const createLounge = async () => {
        setShowStatus(true) // 라운지 상태 모달 띄우기
        setWaiting(true) // 라운지 생성을 기다리는 중
        const token = localStorage.getItem('token');
        try {
            const res = await axios.post(
                process.env.REACT_APP_SERVER_HOST + '/api/lounge' , {
                    introduction: introduction,
                    limitMember: isLimit ? limitMember : 0,
                    mainCategoryId: mainCategoryId,
                    personaId: activePersonaId,
                    senseId: senseId,
                    subCategoryIdList: subCategoryIdList,
                    tagList: [],
                    title: title,
                    imageId: imageId
                }, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            )
            setLoungeId(res.data)
            setWaiting(false)
            setSuccess(true) // 라운지 생성 성공
            addWaitingRoom(res.data) // 라운지 대기 목록에 추가함
            dispatch({type: 'LOUNGE_CREATE', data: res.data});
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div className="open-lounge">
            <div className="modal-background">
                {
                !showStatus
                ? <div className="modal-wrapper" ref={modalInside}>
                <div className="modal-header">
                    <IoChevronBack className="icon" onClick={()=>{backPage()}}/>
                    <span className="text">Lounge Open</span>
                    <IoClose className="icon" onClick={()=>{props.setShowOpenLounge(false)}} />
                </div>
                <div className="modal-content">
                    { page===1 && <Form01 title={title} setTitle={setTitle} mainCategoryId={mainCategoryId} setMainCategoryId={setMainCategoryId} setSubCategoryIdList={setSubCategoryIdList} setFormValidation={setFormValidation}/> }
                    { page===2 && <Form02 title={title} mainCategoryId={mainCategoryId} setFormValidation={setFormValidation} subCategoryIdList={subCategoryIdList} nextPage={nextPage} setSubCategoryIdList={setSubCategoryIdList}/> }
                    { page===3 && <Form03 limitMember={limitMember} setLimitMember={setLimitMember} isLimit={isLimit} setIsLimit={setIsLimit} senseId={senseId} setSenseId={setSenseId} introduction={introduction} setIntroduction={setIntroduction} setPage={setPage} setFormValidation={setFormValidation}/> }
                    { page===4 && <Form04 setFormValidation={setFormValidation} imageId={imageId} setImageId={setImageId} /> }
                </div>
                {
                    page !== 4
                    ? /* 마지막 페이지가 아니라면 */
                    <button className="next-page"
                    onClick={()=>{nextPage()}}
                    disabled={!formValidation}
                    >
                        다음
                    </button>
                    : /* 마지막 페이지라면 */
                    <button className="next-page"
                    id="complete-btn"
                    onClick={()=>{createLounge()}}
                    disabled={!formValidation}
                    >
                        오픈하기
                    </button>
                }

                </div>
                : /* lounge 생성을 기다리는 중이라면,, */
                <div className="modal-wrapper" ref={modalInside}>
                    <LoungeCreateStatus waiting={waiting} success={success} loungeId={loungeId} setShowModal={props.setShowOpenLounge}/>
                </div>
                }
            </div>
        </div>
    )
}

export default OpenLounge;