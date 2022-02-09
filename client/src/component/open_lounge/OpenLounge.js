import { useState, useEffect, useRef } from 'react';
import { IoChevronBack, IoClose } from 'react-icons/io5';
import Form01 from './createForm/Form01';
import Form02 from './createForm/Form02';
import Form03 from './createForm/Form03';
import './OpenLounge.css';

function OpenLounge(props) {
    const modalInside = useRef();

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

    return (
        <div className="open-lounge">
            <div className="modal-background">
                <div className="modal-wrapper" ref={modalInside}>
                <div className="modal-header">
                    <IoChevronBack className="icon" onClick={()=>{setPage(page-1)}}/>
                    <span className="text">Lounge Open</span>
                    <IoClose className="icon" onClick={()=>{props.setShowOpenLounge(false)}} />
                </div>
                <div className="modal-content">
                    { page===1 && <Form01 title={title} setTitle={setTitle} mainCategoryId={mainCategoryId} setMainCategoryId={setMainCategoryId} setSubCategoryIdList={setSubCategoryIdList} setFormValidation={setFormValidation}/> }
                    { page===2 && <Form02 title={title} mainCategoryId={mainCategoryId} setFormValidation={setFormValidation} subCategoryIdList={subCategoryIdList} setSubCategoryIdList={setSubCategoryIdList}/> }
                    { page===3 && <Form03 limitMember={limitMember} setLimitMember={setLimitMember} senseId={senseId} setSenseId={setSenseId} introduction={introduction} setIntroduction={setIntroduction} setFormValidation={setFormValidation}/> }
                </div>
                <button className="next-page"
                onClick={()=>{nextPage()}}
                disabled={!formValidation}
                >
                    다음
                </button>
                </div>
            </div>
        </div>
    )
}

export default OpenLounge;