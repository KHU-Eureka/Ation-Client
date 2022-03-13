import { React, useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

import "../../assets/css/mypage/Delete.css";

function Delete(props) {
    const cookies = new Cookies;
    const DelModal = useRef();

    const {DeleteOpen, title, description, closeDeleteModal, deletePinId, setAddTrue} = props;

    const DeleteModalCloseHandler = ({ target }) => {
        if (DeleteOpen && target.className==="DeleteModal-bg") {
            closeDeleteModal();
        }
    };

    useEffect(() => {
        window.addEventListener('click', DeleteModalCloseHandler);
        return () => {
            window.removeEventListener("click", DeleteModalCloseHandler);
          };
    }, [DeleteOpen])

    const cancleClickHandler = () => {
        closeDeleteModal();
    }

    const deleteClickHandler = async () => {
        if(description === "카드") {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${process.env.REACT_APP_SERVER_HOST}/api/pin/${deletePinId}`, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            closeDeleteModal();
            window.location.reload();
        } else {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${process.env.REACT_APP_SERVER_HOST}/api/pin-board/${deletePinId}`, {
                headers: {
                    Authorization: "Bearer " + token
                }
            });
            setAddTrue(true);
            closeDeleteModal();
            // window.location.reload();
        }
    }

    return (
    <>
    {DeleteOpen?
    <div className="DeleteModal-bg" ref={DelModal}>
        <div className="DeleteModal">
            <div className="title-container">{title}&nbsp;삭제</div>
            <div className="description-container">{description}를 삭제할까요?</div>
            <div className="closeBtn-container">
                <button className="cancle-btn" onClick={cancleClickHandler}>취소</button>
                <button className="delete-btn" onClick={deleteClickHandler}>삭제</button>
            </div>
        </div>
    </div>
    :<></>}
    </>
    );
}

export default Delete;