import { useState, useLayoutEffect, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { MdCheckBox } from 'react-icons/md';

function Form01(props) {
    const cookies = new Cookies();
    const { title, setTitle, mainCategoryId, setMainCategoryId, setSubCategoryIdList, setFormValidation } = props;

    let [mainCategoryList, setMainCategoryList] = useState([]);

    useEffect(()=>{ // 다음 페이지로 넘어갈 수 있는가?
        if (title.length && mainCategoryId) 
            setFormValidation(true)
        else setFormValidation(false)
    }, [title, mainCategoryId, setFormValidation])

    useEffect(()=>{
        // mainCategoryId가 변경될 때마다 이전에 선택되었던 중분류를 지워주기
        setSubCategoryIdList([])
    }, [mainCategoryId, setSubCategoryIdList])

    useLayoutEffect(()=> {
        // 대분류 카테고리 정보 가져오기
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
        getMainCategory();
    }, [])

    return (
        <div className="form01 show-modal-content">
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
                                    id={mainCategory.id}
                                    checked={mainCategoryId===mainCategory.id}
                                    onChange={(e)=>{setMainCategoryId(mainCategory.id)}}
                                />
                                <label htmlFor={mainCategory.id}>{mainCategory.name}</label>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Form01;