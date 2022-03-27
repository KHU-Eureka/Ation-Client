import { useState, useEffect, useLayoutEffect } from "react";
import { Cookies } from "react-cookie";
import axios from "axios";

function Form02(props) {
    const { title, mainCategoryId, subCategoryIdList, setSubCategoryIdList, setFormValidation } = props;

    // 중분류
    let [subCategoryList, setSubCategoryList] = useState([]);

    let [showAlertMsg, setShowAlertMsg] = useState(false);

    const changeHandler = (checked, id) => { 
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

    useEffect(() => { // 다음 페이지로 넘어갈 수 있는가?
        if (subCategoryIdList.length) setFormValidation(true)
        else setFormValidation(false)
    }, [subCategoryIdList, setFormValidation])

    useLayoutEffect(()=> {
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
        getSubCategory();
    }, [])

    return (
        <div className="form02 show-modal-content">
            <div className="input-wrapper">
                <input 
                    type="text"
                    className="room-title"
                    placeholder="방제목을 입력해주세요"
                    value={title}
                    disabled={true}
                />
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
                                    id={subCategory.id}
                                    checked={subCategoryIdList.includes(subCategory.id)}
                                    onChange={(e)=>{changeHandler(e.currentTarget.checked, subCategory.id)}}
                                />
                                <label htmlFor={subCategory.id}>{subCategory.name}</label>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Form02;