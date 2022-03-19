import { createContext, useState } from "react";

export const AttrContextStore = createContext();

export default function AttrContext(props) {
    const [color, setColor] = useState('#1E140A');
    const [mode, setMode] = useState('choice');
    const [detailMode, setDetailMode] = useState('');

    const Attr = {
        color,
        setColor,
        mode,
        setMode,
        detailMode,
        setDetailMode,
    };

    return(
        <AttrContextStore.Provider value={Attr}>
            {props.children}
        </AttrContextStore.Provider>
    );
}