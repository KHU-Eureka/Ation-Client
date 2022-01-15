import React, {useEffect} from "react";
import "../../assets/css/modal/Modal.css";

function Modal(props) {
    const {open, close, header, pageNum, setPageNum} = props;

    useEffect(() => {
        console.log(pageNum);
    }, [pageNum]);

    const onclickHandler = () => {
        if(pageNum > 1) {
            setPageNum(pageNum-1);
        } else {
            setPageNum(1);
        }
    }

    return (
        <div className={open?'openModal modal':'modal'}>
            {open? (
                <>
                    {props.children}
                </>
            ):null}
        </div>
    );
}

export default Modal;

// <section>
                //     <header className={pageNum!=1?'openHeader':'header'} onClick={onclickHandler}>
                //         <img src={header}/>
                //         {/* <button className="close" onClick={close}>&times;</button> */}
                //     </header>
                //     <main>
                //         {props.children}
                //     </main>
                //     <footer className={pageNum==3?'openFooter':'footer'}>
                //         <button className="close" onClick={close}>취소</button>
                //     </footer>
                // </section>