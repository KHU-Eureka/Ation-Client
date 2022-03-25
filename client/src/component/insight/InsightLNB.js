import { React, useState, useEffect } from "react";
import axios from 'axios';

import "../../assets/css/insight/LNB.css"

function InsightLNB(props) {
    const {cate, search, cate1, setCateId} = props;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cateMain, setCateMain] = useState(null);

    const fetchCate = async () => {
        try {
          setError(null);
          setCateMain(null);
          setLoading(true);
          const response = await axios.get(
            process.env.REACT_APP_SERVER_HOST + '/api/category/main'
          );
          setCateMain(response.data);
        } catch (e) {
            setError(e);
        }
        setLoading(false);
      };

    useEffect(() => {
        fetchCate();
    }, []);

    const cateClickHandler = (e) => {
        var li = document.getElementsByClassName("category");
        cate(e.target.innerText);
        setCateId(e.target.getAttribute('id'));

        for (var i = 0; i < li.length; i++) {
            li[i].classList.remove("clicked");
        }
        e.target.classList.add("clicked");
        if(e.target.innerText === "전체" && search !== "") {
            window.location.reload();
        }
    }

    useEffect(() => {
        var li = document.getElementsByClassName("category");
        for (var i = 0; i < li.length; i++) {
            li[i].classList.remove("clicked");
            if(cate1 === li[i].innerHTML) {
                li[i].classList.add("clicked");
            }
        }
    }, [cate1])

    if (loading) return <div>로딩중..</div>;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!cateMain) return null;
    return (
        <div className="LNB-container">
            <li className="category clicked" onClick={cateClickHandler}>전체</li>
            {cateMain.map(category => (
                <li className="category" key={category.id} id={category.id} onClick={cateClickHandler}>{category.name}</li>
            ))}
        </div>
    );
}

export default InsightLNB;