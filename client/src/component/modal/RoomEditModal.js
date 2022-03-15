import { useState, useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { VscChromeClose } from 'react-icons/vsc';
import { IoChevronDownOutline } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";
import SelectBox from '../views/input/SelectBox';
import './RoomEditModal.css';

function RoomEditModal(props) {
    const { roomInfo, setShowModal, setRoomInfo } = props;
    const activePersonaId = useSelector(state=>state.activePersonaId);
    const senseInfoList = useSelector(state=>state.senseInfoList);
    const memberList = [...Array(30)].map((v, i)=>i+1);

    // lounge 정보
    let [title, setTitle] = useState(roomInfo.title);
    let [mainCategoryId, setMainCategoryId] = useState(roomInfo.mainCategory.id);
    let [subCategoryIdList, setSubCategoryIdList] = useState([]);
    let [limitMember, setLimitMember] = useState(roomInfo.limitMember?roomInfo.limitMember:1);
    let [isLimit, setIsLimit] = useState(roomInfo.limitMember);
    let [senseId, setSenseId] = useState(roomInfo.sense.senseId);
    let [introduction, setIntroduction] = useState(roomInfo.introduction);
    let [imageId, setImageId] = useState(roomInfo.imgPath.split('/').slice(-1)[0].split('-')[1].split('.')[0]*1);

    // category 정보
    let [mainCategoryList, setMainCategoryList] = useState([]);
    let [subCategoryList, setSubCategoryList] = useState([]);

    // lounge img 정보
    let [loungeImgList, setLoungeImgList] = useState([]);

    // subCategory 선택 개수 제한 메세지
    let [showAlertMsg, setShowAlertMsg] = useState(false);

    useEffect(()=> {
        console.log(roomInfo.imgPath.split('/').slice(-1)[0].split('-')[1].split('.')[0]);
        //[roomInfo.imgPath.split('/').lastIndexOf()].split('-')[1].split('.')[0]
        console.log("imageId: ",imageId)
        console.log("imgPath : ",loungeImgList.find((elem)=>elem.id===imageId*1))
        for(let i of loungeImgList) {
            console.log(i.id);
        }
    }, [loungeImgList, imageId])

    const updateRoomInfo = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_SERVER_HOST}/api/lounge/${roomInfo.id}`, {
                    headers: {
                        Authorization: {
                            Bearer: 'Bearer ' + token
                        }
                    }
                }
            )
            setRoomInfo(res.data);
        } catch(err) {
            console.log(err);
        }
    }

    const editLoungeInfo = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(
                `${process.env.REACT_APP_SERVER_HOST}/api/lounge/${roomInfo.id}` , {
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
            setShowModal(false);
            updateRoomInfo();
        } catch(err) {
            console.log(err);
        }
    }

    const subCategoryChangeHandler = (checked, id) => {
        setShowAlertMsg(false)
        if (checked) {
            if (subCategoryIdList.length === 3) { // 중분류 3개 이상 선택 막기
                setShowAlertMsg(true)
            } else {
                setSubCategoryIdList([...subCategoryIdList, id])
            }
        } else {
            console.log(subCategoryIdList)
            setSubCategoryIdList(subCategoryIdList.filter((elem) => elem !== id))
        }
    }
    
    useEffect(()=> {
        // 중분류 카테고리 정보 가져오기
        const getSubCategory = async () => {
            var token = localStorage.getItem('token');
            try {
                const res = await axios.get(
                    process.env.REACT_APP_SERVER_HOST + '/api/category/sub?mainCategoryId='+mainCategoryId, {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )
                setSubCategoryList(res.data);
            } catch(err) {
                console.log(err);
            }
        }

        const clearSubCategoryIdList = () => {
            let haveToClear = false;
            for(var id of subCategoryIdList) {
                if (!subCategoryList.includes(id)) {
                    haveToClear = true;
                    break;
                }
            }
            if (haveToClear) setSubCategoryIdList([]);
        }
        getSubCategory();
        clearSubCategoryIdList();
    }, [mainCategoryId])

    useLayoutEffect(()=> { 
        // 메인 카테고리 정보 가져오기
        const getMainCategory = async () => {
            var token = localStorage.getItem('token');
            try {
                const res = await axios.get(
                    process.env.REACT_APP_SERVER_HOST + '/api/category/main', {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                )
                setMainCategoryList(res.data);
            } catch(err) {
                console.log(err);
            }
        }

        const getLoungImgList = async () => {
            const token = localStorage.getItem('token')
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_SERVER_HOST}/api/lounge/image`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                console.log(res.data);
                setLoungeImgList(res.data)
            } catch(err) {
                console.log(err)
            }
        }

        const getSubCategoryIdList = () => {
            console.log("subCategoryList", roomInfo.subCategoryList)
            var tempList = [];
            for(var subCategory of roomInfo.subCategoryList) {
                console.log(subCategory.id);
                tempList.push(subCategory.id);
            }
            setSubCategoryIdList(tempList);
        }

        getMainCategory();
        getSubCategoryIdList();
        getLoungImgList();
    }, [])
   

    return (
        <div className="room-edit">
            <div className="modal-background">
                <div className="modal-wrapper">
                    <VscChromeClose 
                        className="close-btn"
                        onClick={()=>{setShowModal(false)}}
                    />
                    <div className="modal-content">
                        <div className="open-lounge">
                        <div className="input-wrapper">
                            <input 
                                type="text"
                                className="room-title"
                                placeholder="방제목을 입력해주세요"
                                value={title}
                                onChange={(e)=>{setTitle(e.target.value)}}
                            />
                        </div>

                        <div className="input-wrapper">
                            <label>한 줄 소개</label>
                            <textarea
                            id="introduction"
                            value={introduction}
                            maxLength={50}
                            placeholder="라운지를 소개해주세요!"
                            onChange={(e)=>{setIntroduction(e.target.value)}}
                            className="introduction-textarea"
                            ></textarea>
                            <div className="introduction-length">{introduction.length}/50</div>
                        </div>

                        <div className="input-wrapper">
                            <label>분야태그</label>
                            <div className="label-description">
                                라운지에서 이야기나누고 싶은 주제를 선택해주세요!
                            </div>
                            <div className="checkbox-wrapper">
                                {
                                    mainCategoryList && mainCategoryList.map((mainCategory, idx)=> (
                                        <div className="checkbox-elem" key={idx}>
                                            <input 
                                                type="checkbox"
                                                value={mainCategory.id}
                                                name="main-category"
                                                id={"maincategory"+mainCategory.id}
                                                checked={mainCategoryId===mainCategory.id}
                                                onChange={(e)=>{setMainCategoryId(mainCategory.id)}}
                                            />
                                            <label htmlFor={"maincategory"+mainCategory.id}>{mainCategory.name}</label>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                            
                        <div className="input-wrapper">
                            <label>중분류 태그</label>
                            <div className="label-description">
                                세부 태그를 선택해주세요! (최대 3개)
                            </div>
                            <div className="checkbox-wrapper">
                            {   
                                showAlertMsg &&
                                <div className="alert-msg bounce">
                                    최대 3개까지 선택 가능합니다.
                                </div>
                            }
                                {
                                    subCategoryList && subCategoryList.map((subCategory, idx)=> (
                                        <div className="checkbox-elem" key={idx}>
                                            <input 
                                                type="checkbox"
                                                value={subCategory.id}
                                                name="main-category"
                                                id={"subcategory"+subCategory.id}
                                                checked={subCategoryIdList.includes(subCategory.id)}
                                                onChange={(e)=>{subCategoryChangeHandler(e.currentTarget.checked, subCategory.id)}}
                                            />
                                            <label htmlFor={"subcategory"+subCategory.id}>{subCategory.name}</label>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="input-wrapper">
                            <label>최대 인원</label>
                            <div style={{display: 'flex'}}>
                                <div 
                                className="limit-member"
                                id={!isLimit && "disabled"}
                                >
                                    <IoChevronDownOutline className="down-icon"/>
                                    <SelectBox selectedValue={limitMember} setValue={setLimitMember} optionList={memberList}></SelectBox>
                                </div>

                                <div className="is-limit"
                                id={!isLimit && "checked"}
                                onClick={()=>{setIsLimit(!isLimit)}}>
                                    <div className="check">
                                        {!isLimit && <IoMdCheckmark/>}
                                    </div>
                                    <div className="text">
                                    {
                                        isLimit
                                        ? '인원 수 제한 없음'
                                        : '상시 모집'
                                    }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="input-wrapper">
                            <label>선호감각</label>
                            <div className="checkbox-wrapper sense-wrapper">
                                {
                                    senseInfoList && senseInfoList.map((sense, idx) => (
                                        <div className="checkbox-elem sense-elem" key={idx}>
                                            <input
                                                type="checkbox"
                                                id={"sense"+sense.id}
                                                value={sense.id}
                                                checked={senseId===sense.id}
                                                onChange={()=>{setSenseId(sense.id)}}
                                            />
                                            <label htmlFor={"sense"+sense.id}> 
                                                {sense.svg}
                                            </label>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="row1">
                            <div className="input-wrapper">
                                <label>커버이미지</label>
                                <img className="cover-preview" src={loungeImgList && loungeImgList.find((elem)=>elem.id===imageId)?.imgPath} alt="selected background"></img>
                            </div>
                            <div className="input-wrapper">
                                <label>기본 이미지 선택</label>
                                <div className="image-wrapper">
                                    <div className="checkbox-wrapper">
                                        {
                                            loungeImgList && loungeImgList.map((image, idx)=>(
                                                <div className="checkbox-elem image-elem" key={idx}>
                                                    <input 
                                                        type="checkbox"
                                                        id={"image"+image.id}
                                                        value={image.id}
                                                        checked={imageId===image.id}
                                                        onChange={(e)=>{setImageId(image.id);}}
                                                    />
                                                    <label htmlFor={"image"+image.id}>
                                                        <img src={image.imgPath} alt="background"></img>
                                                    </label>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="next-page"
                        id="complete-btn"
                        onClick={()=>{editLoungeInfo()}}
                        disabled={!(title && subCategoryIdList.length && introduction)}
                        >
                            완료
                        </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default RoomEditModal;