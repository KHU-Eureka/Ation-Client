
function ToReadyModal (props) {
    const { sec } = props;

    return (
        <div className="to-ready">
            <div className="title">{ sec }초 뒤에 방이 시작됩니다.</div>
            ready를 하지 않으면 방에서 퇴장됩니다.<br/> 
            <div className="ready">ready 해주세요!</div>
        </div>
    )
}
export default ToReadyModal;