import { createContext, useState } from "react";

export const AttrContextStore = createContext();

export default function AttrContext(props) {
    const [color, setColor] = useState('#1E140A');
    const [width, setWidth] = useState(1);
    const [mode, setMode] = useState('choice');
    const [detailMode, setDetailMode] = useState('');
    const [text, setText] = useState('');

    const Attr = {
        color,
        setColor,
        width,
        setWidth,
        mode,
        setMode,
        detailMode,
        setDetailMode,
        text,
        setText,
    };

    return(
        <AttrContextStore.Provider value={Attr}>
            {props.children}
        </AttrContextStore.Provider>
    );
}