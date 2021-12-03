import { React, useState, useEffect } from "react";

function Create(props) {
    // const [pageNum, setPageNum] = useState(1);
    const [tag, setTag] = useState()
    const {pageNum, setPageNum, close, header} = props;

    const onNextHandler=() => {
        if(pageNum < 3) {
            setPageNum(pageNum+1);
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

    

    if(pageNum == 1) {
        return (
            <>
            <div className="page1">
                <div className="page1-title">인사이트 추가</div>
                <input className="create-input" placeholder="url을 입력해주세요" />
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
                    <button className="category-btn" style={{width:'81px'}}>디자인</button>
                    <button className="category-btn" style={{width:'81px'}}>개발</button>
                    <button className="category-btn" style={{width:'80px'}}>기획</button>
                </div>
                <div className="cate2">
                    <button className="category-btn" style={{width:'127px', marginRight: '6px'}}>뮤직 인사이트</button>
                    <button className="category-btn" style={{width:'126px'}}>비즈니스 경험담</button>
                </div>
                <div className="cate3">
                    <button className="category-btn" style={{width:'81px'}}>마케팅</button>
                    <button className="category-btn" style={{width:'81px'}}>Your View</button>
                    <button className="category-btn" style={{width:'80px'}}>기타</button>
                </div>
                <div className="tag-title">연관 태그</div>
                <div className="tag-container">
                    <label className="tag-label" for="tag-input">#</label>
                    <input className="tag-input" value={tag} placeholder="태그를 입력해주세요(최대2개)" />
                    <button className="tag-btn">추가</button>
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