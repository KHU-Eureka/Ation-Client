import { React, useState, useEffect, useRef, useCallback } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

import "../../assets/css/mypage/PinAdd.css";

function PinAdd(props) {
    const cookies = new Cookies;
    const modalAdd = useRef();
    const {pinAddModalOpen, closeAddModal, pinboard} = props;

    const [urlValue, setUrlValue] = useState("");
    const [pinBoardId, setPinBoardId] = useState(0);
    const [tagList, setTagList] = useState([]);
    const [tagValue, setTagValue] = useState("");

    const PinAddModalCloseHandler = ({ target }) => {
        if (pinAddModalOpen && !modalAdd.current.contains(target) && target.className !== 'tag') {
            closeAddModal();
        }
      };

    useEffect(() => {
        window.addEventListener("click", PinAddModalCloseHandler);
        return () => {
          window.removeEventListener("click", PinAddModalCloseHandler);
        };
    }, [pinAddModalOpen])

    const urlInputChange = (e) => {
        setUrlValue(e.target.value);
    }

    const pinBoardClickHandler = ({ target }) => {
        setPinBoardId(target.getAttribute("id"));
    }

    const ModalAddCloseHandler = async () => {
        const token = cookies.get('token');
        const response = await axios.post('http://163.180.117.22:7218/api/pin', {
                "pinBoardId": pinBoardId,
                "tagList": tagList,
                "url": urlValue
        }, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        await closeAddModal();
        window.location.reload();
    }

    const tagChangeHandler =(e) => {
        setTagValue(e.target.value);
    }

    const tagInputSubmitHandler = useCallback( () => {
        const tag_after = document.querySelector('.tag-after');
        const tags = document.createElement('div');
        tags.className = 'tag';
        tags.addEventListener('click', (e) => {
            tag_after.removeChild(tags);
          })
        if(window.event.keyCode == 13) {
            if(tagList.length < 2) {
                tags.innerHTML = '# ' + tagValue;
                tag_after.appendChild(tags);
                setTagList( prev => [...prev, tagValue]);
                setTagValue("");
                document.querySelector('.url-input').focus();
            }
        }
        }, [tagValue, tagList]
    )

    useEffect(() => {
        console.log(tagList);
        if(document.querySelector('.tag')){
            const tags = document.querySelectorAll('.tag');
            for(var i = 0; i<tags.length; i++) {
                tags[i].addEventListener('click', (e) => {
                    setTagList(tagList.filter( tagValue => tagValue !== e.target.innerHTML.substr(2)));
                  });
                }
        }
    }, [tagList]);
    
    return (
    (pinAddModalOpen?
    <div className="ModalAdd-Container" ref={modalAdd}>
        <div className="Url-container">
            <input className="url-input" value={urlValue} onChange={urlInputChange} placeholder="URL을 입력해주세요."/>
        </div>
        <div className="PinBoard-container">
            {pinboard.map( board => (
                <p className="board-name" id={board.id} onClick={pinBoardClickHandler}>{board.name}</p>
            ))}
        </div>
        <div className="Tag-container">
            <div className="tag-after"></div>
            {tagList.length!==2?<input className="tag-before" value={tagValue} onChange={tagChangeHandler} onKeyPress={tagInputSubmitHandler} maxlength='8'/>:null}
        </div>
            {/* {tagList.length===2?<p>최대 2개까지 추가할 수 있습니다</p>:null} */}
        <div className="Close-container">
            <button className="close-btn" onClick={ModalAddCloseHandler}>저장</button>
        </div>
    </div>
    :null)
    );
}

export default PinAdd;