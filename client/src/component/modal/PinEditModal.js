import React, {useEffect} from "react";
import "../../assets/css/modal/PinEditModal.css";

function PinEditModal(props) {
    const {pinEditModalOpen} = props;

    return (
        <div className={pinEditModalOpen?'openPinEditModal PinEditModal':'PinEditModal'}>
            {pinEditModalOpen? (
                <>
                    {props.children}
                </>
            ):null}
        </div>
    );
}

export default PinEditModal;