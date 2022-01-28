import { useParams } from "react-router-dom";
import LoungeBoard from "../lounge_board/LoungeBoard";
import LoungeWaitSideBar from "../lounge_wait/LoungeWaitSideBar";
import LoungeWaitChatting from "../lounge_wait/LoungeWaitChatting";
import LoungeActiveSideBar from "../lounge_active/LoungeActiveSideBar";

import "../../assets/css/lounge/LoungeRoom.css";
import { useEffect } from "react";

function LoungeRoom () {
    const { mode } = useParams(); // 1) waiting mode 2) active mode

    useEffect(()=> {
        console.log(mode);
    })
    return (
        <div className="lounge-room">
            <div className="left-content">
                {
                    mode === "waiting"
                    ? <LoungeWaitSideBar/>
                    : <LoungeActiveSideBar />
                }
            </div>
            <div className="right-content">
                {
                    mode === "waiting"
                    ? <LoungeWaitChatting/>
                    : <LoungeBoard />
                }
            </div>

        </div>
    )
}

export default LoungeRoom;