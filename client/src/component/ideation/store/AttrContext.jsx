import { createContext, useState } from "react";

export const AttrContextStore = createContext();

export default function AttrContext(props) {
    const [thumbnail, setThumbnail] = useState();
    const [title, setTitle] = useState();

    const Attr = {
        thumbnail,
        setThumbnail,
        title,
        setTitle,
    };

    return(
        <AttrContextStore.Provider value={Attr}>
            {props.children}
        </AttrContextStore.Provider>
    );
}