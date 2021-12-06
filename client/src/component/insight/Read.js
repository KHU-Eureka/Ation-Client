import { React, useState, useEffect } from "react";
import axios from 'axios';

import GNB from "../GNB";
import Reco from "./Reco";
import InsightLNB from "./InsightLNB"
import Modal from "../modal/Modal";
import Create from "./Create";

import prev from "../../assets/svg/prev.svg";
import pin from "../../assets/svg/pin.svg";

import "../../assets/css/insight/Read.css";

function Read() {
    const [pageNum, setPageNum] = useState(1);
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [cate, setCate] = useState("전체");

    //modal...
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => {
        setModalOpen(true);
    }
    const closeModal = () => {
        setModalOpen(false);
        window.location.reload()
    }
    //...modal

    // const fetchInsight = async () => {
    //     try {
    //       // 요청이 시작 할 때에는 error 와 users 를 초기화하고
    //       setError(null);
    //       setInsight(null);
    //       // loading 상태를 true 로 바꿉니다.
    //       setLoading(true);
    //       const response = await axios.get(
    //         'http://163.180.117.22:7218/api/insight'
    //       );
    //       setInsight(response.data); // 데이터는 response.data 안에 들어있습니다.
    //     } catch (e) {
    //       setError(e);
    //     }
    //     setLoading(false);
    //   };

    // useEffect(() => {
    //     fetchInsight();
    // }, []);

    useEffect( async () => {
        console.log(cate);
        if(cate !== "전체") {
            let cateList = [];
            const response = await axios.get(
                'http://163.180.117.22:7218/api/insight'
              );
            console.log(response.data);
            for (var i of response.data) { 
               if(cate === i.insightMainCategory.name) {
                cateList.push(i);
               }
              }
            setInsight(cateList);
            console.log(cateList);
        } else {
            const response = await axios.get(
                'http://163.180.117.22:7218/api/insight'
              );
            setInsight(response.data);
            console.log("asdf");
        }
      }, [cate]);

    const imgClickHandler = async(e) => {
        let temp = e.target.getAttribute('value');
        const response = await axios.get(
            `http://163.180.117.22:7218/api/insight/${temp}`
          );
        window.open(response.data.url);
    }

    const searchHandler = (e) => {
        console.log(e.target.value);
        setSearch(e.target.value);
    }

    const searchClickHandler = async() => {
        const response = await axios.get(
            `http://163.180.117.22:7218/api/insight/search?keyword=${search}`
          );
          console.log(response.data);
        setInsight(response.data);
    }


  
    if (loading) return <div>로딩중..</div>;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!insight) return null;
    return (
        <>
        <GNB />
        <Reco />
        <div className="Insight-container">
            <div className="Search-container">
                <input className="search" value={search} onChange={searchHandler} placeholder="영감을 얻고 싶은 키워드를 검색해 보세요!"></input>
                <input className="search-icn" type="button" onClick={searchClickHandler}></input>
                <button className="search-btn" onClick={()=> {setPageNum(1); openModal();}}>+ Insight</button>
                <Modal open={modalOpen}>
                    <Create pageNum={pageNum} setPageNum={setPageNum} close={closeModal} header={prev}/>
                </Modal>
            </div>
            <div className="Content-container">
                <InsightLNB cate={setCate} setInsight={setInsight}/>
                <div className="img-container">
                    <ul>
                    {insight.map(i => (
                    <li key={i.id}>
                        <img className="thumbnail-box" value={i.id} src={i.imgPath} onClick={imgClickHandler}/>
                        <p>{i.title}</p>
                        {i.tagList.map(tag => (
                            <span> #{tag}</span>
                        ))}
                    </li>
                    ))}
                        {/* <li><img className="thumbnail-box"></img><img src={pin} style={{position: 'absolute', left: '1011px'}}></img></li>
                        <li><img className="thumbnail-box"></img></li>
                        <li><img className="thumbnail-box"></img></li>
                        <li><img className="thumbnail-box"></img></li> */}
                    </ul>
                </div>
            </div>
        </div>
        </>
    );
}

export default Read;