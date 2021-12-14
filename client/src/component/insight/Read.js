import { React, useState, useEffect } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

import GNB from "../GNB";
import Reco from "./Reco";
import InsightLNB from "./InsightLNB"
import Modal from "../modal/Modal";
import Create from "./Create";
import PinUp from "./PinUp";

import prev from "../../assets/svg/prev.svg";
import pin from "../../assets/svg/pin.svg";

import "../../assets/css/insight/Read.css";

function Read() {
    const cookies = new Cookies();
    const [pageNum, setPageNum] = useState(1);
    const [pageNum2, setPageNum2] = useState(1);
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [cate, setCate] = useState("전체");
    const [personaImg, setPersonaImg] = useState([]);
    const [personaId, setPersonaId] = useState(0);
    const [insightId, setInsightId] = useState(0);
    const [userName, setUserName] = useState("");

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
    //modal2...
    const [modal2Open, setModal2Open] = useState(false);
    const openModal2 = () => {
        setModal2Open(true);
    }
    const closeModal2 = () => {
        setModal2Open(false);
        window.location.reload()
    }
    //...modal2

    const PersonaSetting = async () => {
        const token = cookies.get('token');
        const response = await axios.get(
            'http://163.180.117.22:7218/api/persona',
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
          );
        const response2 = await axios.get(
            'http://163.180.117.22:7218/api/persona/user', 
            {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        for(var i of response.data) {
            if(i.id === response2.data.id) {
                setPersonaImg([i]);
                setPersonaId(i.id);
            } 
        }
        for(var i of response.data) {
            if(i.id !== response2.data.id) {
                setPersonaImg(prev => [...prev, i]);
            } 
        }
    }

    const fetchUserName = async () => {
        const token = cookies.get('token');
        const response = await axios.get('http://163.180.117.22:7218/api/auth', {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        setUserName(response.data.name);
        console.log(response);
    }

    useEffect(() => {
        PersonaSetting();
        fetchUserName();
    }, [])

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
        let temp = e.target.getAttribute('id');
        const response = await axios.get(
            `http://163.180.117.22:7218/api/insight/${temp}`
          );
        window.open(response.data.url);
        console.log(e.target);
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

    const imgMouseOverHandler = (e) => {
        if(e.target.className !== 'pin') {
            let temp = e.target.parentNode.getElementsByClassName("pin-box");
            temp[0].classList.add("pin-up");
        } else {
            let temp = e.target.parentNode.parentNode.getElementsByClassName("pin-box");
            temp[0].classList.add("pin-up");
        }
    }

    const imgMouseOutHandler = (e) => {
        if(e.target.className !== 'pin') {
            let temp = e.target.parentNode.getElementsByClassName("pin-box");
            temp[0].classList.remove("pin-up");
        } else {
            let temp = e.target.parentNode.parentNode.getElementsByClassName("pin-box");
            temp[0].classList.remove("pin-up");
        }
    }

    const pinClickHandler = (e) => {
        openModal2();
        setInsightId(e.target.parentNode.parentNode.getAttribute('id'));
    }
  
    if (loading) return <div>로딩중..</div>;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!insight) return null;
    return (
        <>
        <GNB />
        <Reco userName={userName}/>
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
                    <ul className="img-ul">
                    {insight.map(i => (
                    <li key={i.id} className="img-li">
                        <div className="insight-box" id={i.id} onClick={imgClickHandler} onMouseOver={imgMouseOverHandler} onMouseOut={imgMouseOutHandler}>
                            <img className="thumbnail-box" id={i.id} src={i.imgPath} />
                            <div className="pin-box">
                                <img className="pin" src={pin} onClick={pinClickHandler}/>
                            </div>
                        <p id={i.id}>{i.title}</p>
                        {i.tagList.map(tag => (
                            <span id={i.id}> #{tag}</span>
                            ))}
                        </div>
                    </li>
                    ))}
                    <Modal open={modal2Open}>
                        <PinUp pageNum={pageNum2} setPageNum={setPageNum2} close={closeModal2} header={prev} personaImg={personaImg} personaId={personaId} insightId={insightId}/>
                    </Modal>
                    </ul>
                </div>
            </div>
        </div>
        </>
    );
}

export default Read;