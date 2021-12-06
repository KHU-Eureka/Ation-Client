import { React, useState, useEffect } from "react";
import axios from 'axios';

function Create(props) {
    // const [pageNum, setPageNum] = useState(1);
    const {pageNum, setPageNum, close, header} = props;
    const [url, setUrl] = useState("");
    const [mainCategory, setMainCategory] = useState(0);
    const [tag, setTag] = useState("");
    const [hashtag, setHashTag] = useState([]);
    const [hashtagLength, setHashTagLength] = useState(0);

    const onNextHandler=() => {
        if(pageNum < 3) {
            setPageNum(pageNum+1);
            if(pageNum == 2) {
                console.log(pageNum);
                console.log(url);
                console.log(mainCategory);
                console.log(hashtag);
                axios.post('http://163.180.117.22:7218/api/insight', {
                    "insightMainCategoryId": mainCategory,
                    "insightSubCategoryId": 1,
                    "tagList": hashtag,
                      "url": url
                }).then(function (response) {
                    console.log(response);
                }).catch(function (error) {
                    console.log(error);
                  });
            }
        } else {
            setPageNum(3);
        }
    }

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

    const mainCateClickHandler = (e) => {
        setMainCategory(e.target.value);
        console.log(e.target.value)
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
    

    if(pageNum == 1) {
        return (
            <>
            <div className="page1">
                <div className="page1-title">인사이트 추가</div>
                <input className="create-input" value={url} onChange={urlChangeHandler} placeholder="url을 입력해주세요" />
                <button className="create-btn" onClick={onNextHandler}>다음</button>
            </div>
            </>
        );
    } else if(pageNum == 2) {
        return (
            <>
            <div className="page2">
                <img className="prev" src={header} onClick={onPrevHandler}/>
                <div className="create-title">카테고리</div>
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
                <div className="tag-title">연관 태그</div>
                <div className="tag-container">
                    <label className="tag-label" for="tag-input">#</label>
                    <input className="tag-input" value={tag} onChange={tagChangeHandler} placeholder="태그를 입력해주세요(최대2개)" />
                    <button className="tag-btn" onClick={tagClickHandler}>추가</button>
                </div>
                <button className="create-btn" onClick={onNextHandler} style={{marginTop: '51.5px'}}>다음</button>
            </div>
            </>
        );
    } else {
        return (
            <>
            <div className="page3">
                <img className="prev" src={header} onClick={onPrevHandler}/>
                <div className="complete-title">인사이트 추가 완료!</div>
                <div className="complete-description">당신의 인사이트가 누군가에겐 큰 영감이 될 거에요:)</div>
                <div className="filebox">
                    <input className="upload-file" value="Thumbnail" placeholder="Thumbnail" />
                    <label for="file">썸네일 이미지 변경</label> 
                    <input type="file" id="file" />
                </div>
                <div style={{height:'29px'}}>
                    <button className="close" onClick={close} style={{marginRight: '16px'}}>취소</button>
                    <button className="complete-btn" onClick={close}>완료</button>
                </div>
            </div>
            </>
        );
    }

}

export default Create;