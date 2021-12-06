import { React, useState, useEffect } from "react";
import axios from 'axios';

import "../../assets/css/insight/LNB.css"

function InsightLNB(props) {
    const {cate} = props;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cateMain, setCateMain] = useState(null);

    const fetchCate = async () => {
        try {
          setError(null);
          setCateMain(null);
          setLoading(true);
          const response = await axios.get(
            'http://163.180.117.22:7218/api/insight-category/main'
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

        for (var i = 0; i < li.length; i++) {
            li[i].classList.remove("clicked");
        }
        e.target.classList.add("clicked");
    }

    if (loading) return <div>로딩중..</div>;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!cateMain) return null;
    return (
        <div className="LNB-container">
            <li className="category clicked" onClick={cateClickHandler}>전체</li>
            {cateMain.map(category => (
                <li className="category" key={category.id} onClick={cateClickHandler}>{category.name}</li>
            ))}
            {/* <li onClick={cateClickHandler}>전체</li>
            <li>디자인</li>
            <li>개발</li>
            <li>기획</li>
            <li>마케팅</li>
            <li>뮤직 인사이트</li>
            <li>비즈니스 경험담</li>
            <li>Your View</li> */}
        </div>
    );
}

export default InsightLNB;