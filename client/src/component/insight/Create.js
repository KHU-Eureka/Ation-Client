import { React, useState, useEffect, useRef } from "react";
import axios from 'axios';

function Create(props) {
    // const [pageNum, setPageNum] = useState(1);
    const {modalOpen, pageNum, setPageNum, close, header} = props;
    const modalCreate = useRef();
    const [url, setUrl] = useState("");
    const [mainCategory, setMainCategory] = useState(0);
    const [mainCategoryName, setMainCategoryName] = useState("");
    const [tag, setTag] = useState("");
    const [hashtag, setHashTag] = useState([]);
    const [hashtagLength, setHashTagLength] = useState(0);
    const [subCategory, setSubCategory] = useState([]);
    const [ClickedSubCategory, setClickedSubCategory] = useState([]);
    const [InsightId, setInsightId] = useState(0);
    const [imgUrl, setImgURL] = useState("");

    const CreateInsightCloseHandler = ({ target }) => {
        console.log(modalCreate.current);
        if(target.className!=='complete-btn') {
            if(modalOpen && !modalCreate.current.contains(target) && target.className!=='create-btn' && target.className!=='prev' && target.className!=='close' && target.className!=='complete-btn') {
                console.log(target);
                close();
            }

        }
    }

    useEffect(() => {
        if(modalOpen) {
            window.addEventListener('click', CreateInsightCloseHandler);
            return () => {
                window.removeEventListener('click', CreateInsightCloseHandler);
            }
        } else {
            console.log("goodd")
        }
    }, [modalOpen]);

    const onNextHandler= async () => {
        if(pageNum < 5) {
            console.log(pageNum);
            console.log(url);
            console.log(mainCategory);
            console.log(ClickedSubCategory);
            console.log(hashtag);
            setPageNum(pageNum+1);
            if(pageNum == 4) {
                console.log("good");
                const response = await axios.post('http://163.180.117.22:7218/api/insight', {
                    "insightMainCategoryId": mainCategory,
                    "insightSubCategoryIdList": ClickedSubCategory,
                    "tagList": hashtag,
                    "url": url
                });
                setInsightId(response.data);
            }
        } else {
            console.log(pageNum);
            console.log(modalOpen);
            await close();
            // setPageNum(5);
        }
    }

    useEffect( async () => {
        const response = await axios.get(`http://163.180.117.22:7218/api/insight/${InsightId}`);
        setImgURL(response.data.imgPath);
    }, [InsightId]);

    const onPrevHandler=() => {
        if(pageNum > 1) {
            setPageNum(pageNum-1);
        } else {
            setPageNum(1);
        }
    }

    const urlChangeHandler = (e) => {
        setUrl(e.target.value);
    }

    const mainCateClickHandler = async (e) => {
        setMainCategory(e.target.value);
        setMainCategoryName(e.target.innerHTML);
        console.log(e.target.value);
        const response = await axios.get(`http://163.180.117.22:7218/api/insight-category/sub?insightMainCategoryId=${e.target.value}`);
        setSubCategory(response.data);
    }

    const tagChangeHandler = (e) => {
        console.log(hashtagLength+"asdf")
        console.log(hashtag);
        if(hashtagLength < 2){
            console.log(e.target.value);
            setTag(e.target.value);
        } else {
            e.preventDefault();
            alert("해시태그는 최대 2개입니다.")
        }
    }

    const tagClickHandler = () => {
        //e.target.classList.add("clicked");
        if(hashtagLength < 1){
            let tag2 = tag.substring(tag.indexOf("#", 0)+1);
            setHashTag(prev => [...prev, tag2]);
            setTag(`${tag}   #`);
        } else if(hashtagLength === 1) {
            let tag2 = tag.substring(tag.indexOf("#", 0)+1);
            setHashTag(prev => [...prev, tag2]);
        } else {
            alert("해시태그는 최대 2개입니다.");
        }
    }

    useEffect(() => {
        console.log(hashtag);
        setHashTagLength(hashtag.length);
        console.log(hashtagLength)
    }, [hashtag, hashtagLength])

    const subCateClickHandler = (e) => {
        setClickedSubCategory( prev => [...prev, e.target.getAttribute('id')]);
    }

    const thumnailChangeHandler = (e) => {
        console.log(e.target);
    }

    async function readImage (e) {
        var formData = new FormData();
        formData.append('insightImg', e.target.files[0]);
        console.log(InsightId, formData.get('insightImg'));
        const response = await axios.post(`http://163.180.117.22:7218/api/insight/image/${InsightId}`, formData);
        // if(e.target.files && e.target.files[0]) {
        //     const reader = new FileReader()
        //     reader.onload = event => {
        //         const previewImage = document.getElementsByClassName("upload-file");
        //         previewImage.src = event.target.result;
        //     }
        //     reader.readAsDataURL(e.target.files[0]);
        // }
        setImgURL(response.data.imgPath);
    }

    useEffect(() => {
        const previewImage = document.getElementsByClassName("upload-file");
        previewImage.src = imgUrl;
    }, [imgUrl])

    const fileInput = (e) => {
        console.log("asdf")
        console.log(e.target.files[0]);
    }
    

    if(modalOpen) {
        if(pageNum == 1) {
            return (
                <>
                <div className="page1" ref={modalCreate}>
                    <div className="page1-title">인사이트 추가</div>
                    <input className="create-input" value={url} onChange={urlChangeHandler} placeholder="url을 입력해주세요" />
                    <button className="create-btn" onClick={onNextHandler}>다음</button>
                </div>
                </>
            );
        } else if(pageNum == 2) {
            return (
                <>
                <div className="page2" ref={modalCreate}>
                    <img className="prev" src={header} onClick={onPrevHandler}/>
                    <div className="create-title">분야선택</div>
                    <div className="page2-description">대표 카테고리 한 가지만 선택해주세요</div>
                    <div className="cate1">
                        <button className="category-btn" value={1} onClick={mainCateClickHandler} style={{width:'81px'}}>디자인</button>
                        <button className="category-btn" value={2} onClick={mainCateClickHandler} style={{width:'81px'}}>개발</button>
                        <button className="category-btn" value={3} onClick={mainCateClickHandler} style={{width:'80px'}}>기획</button>
                    </div>
                    <div className="cate2">
                        <button className="category-btn" value={4} onClick={mainCateClickHandler} style={{width:'127px', marginRight: '6px'}}>뮤직 인사이트</button>
                        <button className="category-btn" value={5} onClick={mainCateClickHandler} style={{width:'126px'}}>비즈니스 경험담</button>
                    </div>
                    <div className="cate3">
                        <button className="category-btn" value={6} onClick={mainCateClickHandler} style={{width:'81px'}}>마케팅</button>
                        <button className="category-btn" value={7} onClick={mainCateClickHandler} style={{width:'81px'}}>Your View</button>
                        <button className="category-btn" value={8} onClick={mainCateClickHandler} style={{width:'80px'}}>기타</button>
                    </div>
                    <button className="create-btn" onClick={onNextHandler} style={{marginTop: '51.5px'}}>다음</button>
                </div>
                </>
            );
        } else if(pageNum === 3) {
            return (
            <div className="page3" ref={modalCreate}>
                    <img className="prev" src={header} onClick={onPrevHandler}/>
                    <div className="create-title">분야선택</div>
                    <div className="page2-description">연관 태그를 최대 3개 선택해 주세요.</div>
                    <div className="main-category">{mainCategoryName}</div>
                    <div className="subCate-Container">
                        {subCategory.map( cate => (
                            <div className="category-btn" id={cate.id} onClick={subCateClickHandler}>{cate.name}</div>
                        ))}
                    </div>
                    <button className="create-btn" onClick={onNextHandler} style={{marginTop: '51.5px'}}>다음</button>
                </div>
            );
        } else if(pageNum === 4) {
            return (
                <div className="page3" ref={modalCreate}>
                <div className="tag-title">연관 태그</div>
                    <div className="tag-container">
                        <label className="tag-label" for="tag-input">#</label>
                        <input className="tag-input" value={tag} onChange={tagChangeHandler} placeholder="태그를 입력해주세요(최대2개)" />
                        <button className="tag-btn" onClick={tagClickHandler}>추가</button>
                    </div>
                    <button className="create-btn" onClick={onNextHandler} style={{marginTop: '51.5px'}}>다음</button>
                </div>
            );
        } else {
            return (
                <>
                <div className="page3" ref={modalCreate}>
                    <img className="prev" src={header} onClick={onPrevHandler}/>
                    <div className="complete-title">인사이트 추가 완료!</div>
                    <div className="complete-description">당신의 인사이트가 누군가에겐 큰 영감이 될 거에요:)</div>
                    <div className="filebox">
                        {/* <input className="upload-file" value="Thumbnail" placeholder="Thumbnail" />
                        <label for="file">썸네일 이미지 변경</label>  */}
                        <img className="upload-file" value="Thumbnail" src={imgUrl}/>
                        <label for="file">썸네일 이미지 변경</label> 
                        <input type="file" id="file" onChange={readImage}/>
                        {/* onChange={(e) => {fileInput(e); readImage(e.target);}} */}
                    </div>
                    <div style={{height:'29px'}}>
                        <button className="close" onClick={() => close()} style={{marginRight: '16px'}}>취소</button>
                        <button className="complete-btn" onClick={onNextHandler}>완료</button>
                    </div>
                </div>
                </>
                ); 
            }
    } else {
        return(<></>);
    }
}

export default Create;