import { React, useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Cookies } from 'react-cookie';

import "../../assets/css/mypage/PinEdit.css";

function PinEdit(props) {
    const cookies = new Cookies;
    const modalEdit = useRef();
    const { pinEditModalOpen, clickedPin, closeEditModal, editPosition} = props;

    const [personas, setPersonas] = useState([]);
    const [pinboards, setPinboards] = useState([]);
    const [clickedPersonaId, setClickedPersonaId] = useState(0);
    const [afterPinboardId, setAfterPinboardId] = useState(0);
    const [afterTag, setAfterTag] = useState([]);
    const [tagValue, setTagValue] = useState("");

    let style = {
        top:editPosition[1],
        left:editPosition[0]
    }

    const PinEditModalCloseHandler = ({ target }) => {
        console.log(target);
        if (pinEditModalOpen && !modalEdit.current.contains(target) && target.className !== 'Mypin-edit' && target.className !== 'tag') {
            closeEditModal();
        }
    };

    useEffect(() => {
        window.addEventListener('click', PinEditModalCloseHandler);
        return () => {
            window.removeEventListener("click", PinEditModalCloseHandler);
          };
    }, [pinEditModalOpen])

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
        setClickedPersonaId(response2.data.id);
        for(var i of response.data) {
            if(i.id === response2.data.id) {
                setPersonas([i]);
            } 
        }
        for(var i of response.data) {
            if(i.id !== response2.data.id) {
                setPersonas(prev => [...prev, i]);
            } 
        }
    }

    const pinboardImport = async () => {
        const token = cookies.get('token');
        const response = await axios.get(`http://163.180.117.22:7218/api/pin-board?personaId=${clickedPersonaId}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        setPinboards(response.data);
    }

    useEffect(() => {
        PersonaSetting();
        if(clickedPin) {
            setAfterPinboardId(clickedPin.pinBoard.id);
            setAfterTag(clickedPin.tagList);
        }
    }, [editPosition])

    useEffect(() => {
        pinboardImport();
    }, [clickedPersonaId]);

    const personaClickHandler = async (e) => {
        setClickedPersonaId(e.target.getAttribute("id"));
    }

    const pinboardClickHandler = (e) => {
        setAfterPinboardId(e.target.getAttribute("id"));
    }

    const closeBtnClickHandler = async () => {
        const token = cookies.get('token');
        const response = await axios.put(`http://163.180.117.22:7218/api/pin/${clickedPin.id}`,
        {
            "pinBoardId": afterPinboardId,
            "tagList": afterTag
          }, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        alert("핀이 수정되었습니다");
        closeEditModal();
        window.location.reload();
    }

    const tagChangeHandler = (e) => {
        setTagValue(e.target.value);
    }

    const tagInputSubmitHandler = () => {
        const tag_after = document.querySelector('.tag-after');
        const tags = document.createElement('div');
        tags.className = 'tag';
        tags.addEventListener('click', () => {
            tag_after.removeChild(tags);
          })
        if(window.event.keyCode == 13) {
            if(afterTag.length < 2) {
                console.log(afterTag.length);
                setAfterTag( prev => [...prev, tagValue]);
                setTagValue("");
            }
        }
    }

    useEffect(() => {
        console.log(afterTag);
        if(document.querySelector('.tag')){
            const tags = document.querySelectorAll('.tag');
            for(var i = 0; i<tags.length; i++) {
                tags[i].addEventListener('click', (e) => {
                    setAfterTag(afterTag.filter( tagValue => tagValue !== e.target.innerHTML.substr(2)));
                  });
                }
        }
    }, [afterTag]);

    return (
    <>
    {pinEditModalOpen? (        
    <div className="PinEdit-Container" ref={modalEdit} style={style}>
        <div className="PersonaImg-Container">
            {personas.map( persona => (
                <img className="persona-img" id={persona.id} src={persona.profileImgPath} onClick={personaClickHandler}/>
            ))}
        </div>
        <div className="PinBoard-Container">
            {pinboards.map( pinboard => (
                <p className="pinboard-name" id={pinboard.id} onClick={pinboardClickHandler}>{pinboard.name}</p>
            ))}
        </div>
        <div className="Tag-Container">
            <div className="tag-after">
                {afterTag?afterTag.map( tag => (
                    <div className="tag"># {tag}</div>
                )):<></>}
            </div>
                {afterTag.length!==2?
                <input className="tag-before" value={tagValue} onChange={tagChangeHandler} onKeyPress={tagInputSubmitHandler} maxlength='8'/>:null}
        </div>
        <div className="CloseBtn-Container">
            <button className="close-btn" onClick={closeBtnClickHandler}>저장</button>
        </div>
    </div>
    ):null}
    </>);
}

export default PinEdit;