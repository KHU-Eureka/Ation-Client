import { useState, useEffect, useLayoutEffect } from "react";
import { Cookies } from "react-cookie";
import axios from "axios";

import image1 from '../../../assets/image/lounge/image 188.jpg';
import image2 from '../../../assets/image/lounge/image 189.jpg';
import image3 from '../../../assets/image/lounge/image 190.jpg';
import image4 from '../../../assets/image/lounge/image 191.jpg';
import image5 from '../../../assets/image/lounge/image 192.jpg';
import image6 from '../../../assets/image/lounge/image 193.jpg';
import image7 from '../../../assets/image/lounge/image 194.jpg';
import image8 from '../../../assets/image/lounge/image 195.jpg';
import image9 from '../../../assets/image/lounge/image 196.jpg';
import image10 from '../../../assets/image/lounge/image 197.jpg';
import image11 from '../../../assets/image/lounge/image 198.jpg';
import image12 from '../../../assets/image/lounge/image 199.jpg';
import image13 from '../../../assets/image/lounge/image 200.jpg';
import image14 from '../../../assets/image/lounge/image 201.jpg';

function Form04(props) {
    const cookies = new Cookies();
    const { imageId, setImageId, setFormValidation } = props;

    let [loungeImgList, setLoungeImgList] = useState([]);
    const imageList = [ {id: 1, img: image1}, {id: 2, img: image2}, {id: 3, img: image3}, {id: 4, img: image4}, {id: 5, img: image5}, {id: 6, img: image6}, {id: 7, img: image7}, 
                        {id: 8, img: image8}, {id: 9, img: image9}, {id: 10, img: image10}, {id: 11, img: image11}, {id: 12, img: image12}, {id: 13, img: image13}, {id: 14, img: image14} ]

    useEffect(()=> {
        setFormValidation(true);
    }, [])

    useLayoutEffect(()=> {
        const getLoungImgList = async () => {
            const token = localStorage.getItem('token')
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_SERVER_HOST}/api/lounge/image`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                console.log(res.data);
                setLoungeImgList(res.data)
            } catch(err) {
                console.log(err)
            }
        }
        getLoungImgList();
    }, [])

    return (
        <div className="form04 show-modal-content">
            <div className="row1">
                <div className="input-wrapper">
                    <label>커버이미지</label>
                    <img className="cover-preview" src={loungeImgList && loungeImgList.find((elem)=>elem.id===imageId)?.imgPath} alt="selected background"></img>
                </div>
                <div className="input-wrapper">
                    <label>기본 이미지 선택</label>
                    <div className="image-wrapper">
                        <div className="checkbox-wrapper">
                            {
                                loungeImgList && loungeImgList.map((image, idx)=>(
                                    <div className="checkbox-elem image-elem" key={idx}>
                                        <input 
                                            type="checkbox"
                                            id={image.id}
                                            value={image.id}
                                            checked={imageId===image.id}
                                            onChange={(e)=>{setImageId(image.id);}}
                                        />
                                        <label htmlFor={image.id}>
                                            <img src={image.imgPath} alt="background" loading="lazy"></img>
                                        </label>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Form04;