import { React, useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

import "../../assets/css/modal/Modal.css";
import fail_logo from "../../assets/svg/fail_logo.svg";

function Create(props) {
    const cookies = new Cookies;
    // const [pageNum, setPageNum] = useState(1);
    const {modalOpen, pageNum, setPageNum, close, header, setAddTrue} = props;
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
    const [ChangeImgFormdata, setChangeImgFormdata] = useState();
    const [prevImgUrl, setPrevImgUrl] = useState("");
    const [urlTrue, setUrlTrue] = useState(false);
    const [insightTrue, setInsightTrue] = useState(null);
    const [loading, setLoading] = useState(false);

    const CreateInsightCloseHandler = async ({ target }) => {
        console.log(modalCreate.current);
        if(target.className!=='create-btn2') {
            if(target.className!=='complete-btn' && target.className!=='tag' && target.className!=='close' && target.className!=='skip-btn') {
                if(modalOpen && !modalCreate.current.contains(target) && target.className!=='create-btn' && target.className!=='prev' && target.className!=='close' && target.className!=='complete-btn') {
                    await setClickedSubCategory([]);
                    await setMainCategory(0);
                    await setMainCategoryName("");
                    await setUrl("");
                    await setHashTag([]);
                    await setChangeImgFormdata();
                    await setAddTrue(false);
                    await setUrlTrue(false);
                    await setInsightTrue(null);
                    close();
                }
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

    const onNextHandler= async (e) => {
        if(pageNum < 5) {
            setPageNum(pageNum+1);
            if(pageNum === 4) {
                if(e.target.classList.contains('create-btn2') ) {
                    if(hashtag.length === 0) {
                        setPageNum(4);
                    } else {
                        try {
                            const response = await axios.post(process.env.REACT_APP_SERVER_HOST + '/api/insight', {
                                "mainCategoryId": mainCategory,
                                "subCategoryIdList": ClickedSubCategory,
                                "tagList": hashtag,
                                "url": url
                            });
                            setInsightId(response.data);
                            setInsightTrue(response.status);
                        } catch(err) {
                            setInsightTrue(400);
                        }
                    }
                } else {
                    try {
                        const response = await axios.post(process.env.REACT_APP_SERVER_HOST + '/api/insight', {
                            "mainCategoryId": mainCategory,
                            "subCategoryIdList": ClickedSubCategory,
                            "tagList": [],
                            "url": url
                        });
                        setInsightId(response.data);
                        setInsightTrue(response.status);
                    } catch(err) {
                        setInsightTrue(400);
                    }
                }
            } else if (pageNum === 1) {
                if(!urlTrue) {
                    setPageNum(1);
                } 
            } else if (pageNum === 2) {
                if(mainCategory === 0) {
                    setPageNum(2);
                }
            } 
        } else {
            console.log(pageNum);
            console.log(modalOpen);
            setMainCategory(0);
            setMainCategoryName("");
            setUrl("");
            setClickedSubCategory([]);
            setHashTag([]);
            setChangeImgFormdata();
            setInsightTrue(null);
            if(e.target.className === 'complete-btn') {
                if(ChangeImgFormdata) {
                    const response = await axios.post(`${process.env.REACT_APP_SERVER_HOST}/api/insight/image/${InsightId}`, ChangeImgFormdata);
                    await setImgURL(response.data.imgPath);
                }
                setAddTrue(true);
                // window.location.reload();
            }
            await close();
        }
    }

    useEffect( async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/insight/${InsightId}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        }
        );
        setPrevImgUrl(response.data.imgPath);
    }, [InsightId]);

    const onPrevHandler=() => {
        if(pageNum > 1) {
            setPageNum(pageNum-1);
        } else {
            setPageNum(1);
        }
    }

    const urlChangeHandler = (e) => {
        if(e.target.value === "") {
            document.querySelector('.create-btn').classList.add('noPlayBtn');
            setUrlTrue(false);
        } else {
            if(e.target.value.includes('https://')) {
                document.querySelector('.create-btn').classList.remove('noPlayBtn');
                setUrlTrue(true);
            } else {
                document.querySelector('.create-btn').classList.add('noPlayBtn');
                setUrlTrue(false);
            }
        }
        setUrl(e.target.value);
    }

    const mainCateClickHandler = async (e) => {
        setClickedSubCategory([]);
        setMainCategory(e.target.value);
        setMainCategoryName(e.target.innerHTML);
        console.log(e.target);
        const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/category/sub?mainCategoryId=${e.target.value}`);
        setSubCategory(response.data);
        const cateBtn = document.querySelectorAll('.category-btn');
        for(var i=0;i<cateBtn.length;i++) {
            cateBtn[i].classList.remove('cateBtn-clicked');
        }
        e.target.classList.add('cateBtn-clicked');
    }

    const tagChangeHandler = (e) => {
        console.log(hashtagLength+"asdf")
        console.log(hashtag);
        if(hashtagLength < 2){
            console.log(e.target.value);
            setTag(e.target.value);
        } else {
            e.preventDefault();
        }
    }

    const subCateClickHandler = (e) => {
        if(ClickedSubCategory.length < 3) {
            setClickedSubCategory( prev => [...prev, e.target.getAttribute('id')]);
            const cateBtn = document.querySelectorAll('.category-btn');
            for(var i=0;i<cateBtn.length;i++) {
                if(!ClickedSubCategory.includes(cateBtn[i].getAttribute('id'))) {
                    cateBtn[i].classList.remove('cateBtn2-clicked');
                    console.log(ClickedSubCategory);
                }
            }
            e.target.classList.add('cateBtn2-clicked');
        }
        if(ClickedSubCategory.includes(e.target.getAttribute('id'))) {
            console.log("asdf")
            setClickedSubCategory(ClickedSubCategory.filter( cate => cate!==e.target.getAttribute('id')));
            e.target.classList.remove('cateBtn2-clicked');
        }
    }

    useEffect(() => {
        if(pageNum===1) {
            if(document.querySelector('.create-btn') && url === "") {
                // document.querySelector('.create-btn').style.color="#FFA48C";
                // document.querySelector('.create-btn').style.border="1px solid #FFA48C";
                document.querySelector('.create-btn').classList.add('noPlayBtn');
            }
        } else if(pageNum===2) {
            if(mainCategory === 0) {
                // document.querySelector('.create-btn').style.color="#FFA48C";
                // document.querySelector('.create-btn').style.border="1px solid #FFA48C";
                document.querySelector('.create-btn').classList.add('noPlayBtn');
            } else {
                // document.querySelector('.create-btn').style.color="#FE3400";
                // document.querySelector('.create-btn').style.border="1px solid #FE3400";
                document.querySelector('.create-btn').classList.remove('noPlayBtn');
            }
            const cateBtn = document.querySelectorAll('.category-btn');
            for(var i=0;i<cateBtn.length;i++) {
                if(mainCategory!==cateBtn[i].getAttribute('value')) {
                    cateBtn[i].classList.remove('cateBtn-clicked');
                } else {
                    cateBtn[i].classList.add('cateBtn-clicked');
                }
            }
        } else if(pageNum===3) {
            const cateBtn = document.querySelectorAll('.category-btn');
            for(var i=0;i<cateBtn.length;i++) {
                if(!ClickedSubCategory.includes(cateBtn[i].getAttribute('id'))) {
                    cateBtn[i].classList.remove('cateBtn2-clicked');
                } else {
                    cateBtn[i].classList.add('cateBtn2-clicked');
                }
            }
        } else if(pageNum===4) {
            if(document.querySelector('.create-btn2') && hashtag.length === 0) {
                // document.querySelector('.create-btn2').style.color="#FFA48C";
                // document.querySelector('.create-btn2').style.border="1px solid #FFA48C";
                document.querySelector('.create-btn2').classList.add('noPlayBtn');
            } else if(hashtag.length !== 0) {
                // document.querySelector('.create-btn2').style.color="#FE3400";
                // document.querySelector('.create-btn2').style.border="1px solid #FE3400";
                document.querySelector('.create-btn2').classList.remove('noPlayBtn');
            }
        }
    }, [modalOpen, url, pageNum, mainCategory, hashtag])

    async function readImage (e) {
        var formData = new FormData();
        formData.append('insightImg', e.target.files[0]);
        console.log(formData);
        setChangeImgFormdata(formData);
        const reader = new FileReader();
        setPrevImgUrl(URL.createObjectURL(e.target.files[0]));
        reader.readAsDataURL(e.target.files[0]);
        // console.log(reader.readAsDataURL(e.target.files[0]));
    }

    useEffect(() => {
        const previewImage = document.getElementsByClassName("upload-file");
        previewImage.src = prevImgUrl.substring(5);
        console.log(prevImgUrl.substring(5))
    }, [prevImgUrl])

    const tagInputSubmitHandler = (e) => {
        if(window.event.keyCode == 13) {
            if(hashtag.length < 5) {
                setHashTag( prev => [...prev, tag]);
                setTag("");
                document.querySelector('.tag-length').style.display="none";
            } else {
                document.querySelector('.tag-length').style.display="inline";
            }
        }
    }

    const tagClickHandler = (e) => {
        setHashTag(hashtag.filter( tag => tag !== e.target.innerHTML));
    }

    useEffect(() => {
        if(hashtag.length < 5 && document.querySelector('.tag-length')) {
            document.querySelector('.tag-length').style.display="none";
        }
    }, [hashtag])
    

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
                        <button className="category-btn" value={5} onClick={mainCateClickHandler} style={{width:'127px', marginRight: '6px'}}>뮤직 인사이트</button>
                        <button className="category-btn" value={6} onClick={mainCateClickHandler} style={{width:'126px'}}>비즈니스 경험담</button>
                    </div>
                    <div className="cate3">
                        <button className="category-btn" value={4} onClick={mainCateClickHandler} style={{width:'81px'}}>마케팅</button>
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
                    <img className="prev" src={header} onClick={onPrevHandler}/>
                    <div className="tag-title">추가 태그</div>
                    <div className="tag-description">태그를 더 추가하면 많이 노출될 수 있어요!</div>
                    <div className="tag-container">
                        <input className="tag-input" value={tag} onChange={tagChangeHandler} onKeyPress={tagInputSubmitHandler} maxlength='8' placeholder="태그를 입력해주세요(최대5개)" />
                    </div>
                    <div className="tag-length" style={{display: 'none'}}>최대 5개까지 추가할 수 있습니다</div>
                    <div className="tag-after">
                        {hashtag?hashtag.map( tag => (<div className="tag" onClick={tagClickHandler}>{tag}</div>)):<></>}
                    </div>
                    <button className="skip-btn" onClick={onNextHandler} style={{marginTop: '51.5px'}}>건너뛰기</button>
                    <button className="create-btn2" id="create-btn" onClick={onNextHandler} style={{marginTop: '51.5px'}}>다음</button>
                </div>
            );
        } else if(insightTrue === 201) {
            return (
                <>
                <div className="page3" ref={modalCreate}>
                    <img className="prev" src={header} onClick={onPrevHandler}/>
                    <div className="complete-title">인사이트 추가 완료!</div>
                    <div className="complete-description">당신의 인사이트가 누군가에겐 큰 영감이 될 거에요:)</div>
                    <div className="filebox">
                        {/* <input className="upload-file" value="Thumbnail" placeholder="Thumbnail" />
                        <label for="file">썸네일 이미지 변경</label>  */}
                        <img className="upload-file" value="Thumbnail" src={prevImgUrl}/>
                        <label for="file">썸네일 이미지 변경</label> 
                        <input type="file" id="file" onChange={readImage}/>
                        {/* onChange={(e) => {fileInput(e); readImage(e.target);}} */}
                    </div>
                    <div>
                        <button className="complete-btn" onClick={onNextHandler}>완료</button>
                    </div>
                </div>
                </>
                ); 
            } else if(insightTrue === 400) {
                return(
                <div className="page3" ref={modalCreate}>
                    <div>
                        <img className="prev" src={header} onClick={onPrevHandler}/>
                    </div>
                    <img className="fail_logo" src={fail_logo}/>
                    <p className="header-title2">
                        인사이트 추가 실패
                    </p>
                </div>
            );
            } else {
                return(<></>);
            }
    } else {
        return(<></>);
    }
}

export default Create;
