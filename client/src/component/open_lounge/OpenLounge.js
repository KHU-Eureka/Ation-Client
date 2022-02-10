import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { IoChevronBack, IoClose } from 'react-icons/io5';
import Form01 from './createForm/Form01';
import Form02 from './createForm/Form02';
import Form03 from './createForm/Form03';
import Form04 from './createForm/Form04';
import LoungeCreateStatus from './LoungeCreateStatus';
import './OpenLounge.css';

function OpenLounge(props) {
    const cookies = new Cookies();
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
    let [senseId, setSenseId] = useState(null);
    let [introduction, setIntroduction] = useState('');
    
    // lounge status 정보
    let [showStatus, setShowStatus] = useState(false);
    let [waiting, setWaiting] = useState(false); // 라운지 생성을 기다리고 있는가?
    let [success, setSuccess] = useState(false);


    const clickOutside = (e) => {
        if (!modalInside.current.contains(e.target)) {
            props.setShowOpenLounge(false);
        }
    }

    const nextPage = () => {
        setPage(page + 1);
        setFormValidation(false);
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
        const token = cookies.get('token');
        try {
            await axios.post(
                process.env.REACT_APP_SERVER_HOST + '/api/lounge' , {
                    introduction: introduction,
                    limitMember: limitMember,
                    mainCategoryId: mainCategoryId,
                    personaId: activePersonaId,
                    senseId: senseId,
                    subCategoryIdList: subCategoryIdList,
                    tagList: [],
                    title: title
                }, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            )
            setWaiting(false)
            setSuccess(true) // 라운지 생성 성공
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
                    <IoChevronBack className="icon" onClick={()=>{setPage(page-1)}}/>
                    <span className="text">Lounge Open</span>
                    <IoClose className="icon" onClick={()=>{props.setShowOpenLounge(false)}} />
                </div>
                <div className="modal-content">
                    { page===1 && <Form01 title={title} setTitle={setTitle} mainCategoryId={mainCategoryId} setMainCategoryId={setMainCategoryId} setSubCategoryIdList={setSubCategoryIdList} setFormValidation={setFormValidation}/> }
                    { page===2 && <Form02 title={title} mainCategoryId={mainCategoryId} setFormValidation={setFormValidation} subCategoryIdList={subCategoryIdList} nextPage={nextPage} setSubCategoryIdList={setSubCategoryIdList}/> }
                    { page===3 && <Form03 limitMember={limitMember} setLimitMember={setLimitMember} senseId={senseId} setSenseId={setSenseId} introduction={introduction} setIntroduction={setIntroduction} setPage={setPage} setFormValidation={setFormValidation}/> }
                    { page===4 && <Form04 setFormValidation={setFormValidation} /> }
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
                    <LoungeCreateStatus waiting={waiting} success={success}/>
                </div>
                }
            </div>
        </div>
    )
}

export default OpenLounge;