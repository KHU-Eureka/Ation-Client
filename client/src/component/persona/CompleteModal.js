import React, { useState } from 'react';

function CompletedModal(props) {
    const closeModal = () => {
        props.closeModal();
    }
    return (
        <div className="modal-background">
            <div className="modal-wrapper">
                <div className="modal-header">
                    <div className="completed-circle"></div>
                </div>

                <div className="modal-content">
                    <div className="modal-title">Let's Sensation</div>
                    <div className="modal-sub-title">
                        페르소나 등록이 완료되었습니다! 사람들과 재미있게 아이디어를 나눠보세요!
                    </div>
                </div>

                <div className="modal-footer">
                    <div className="modal-description">
                        또 다른 페르소나의 등록은 <br/>
                        마이페이지에서 할 수 있어요!
                    </div>
                </div>

            </div>

        </div>
    );
}

export default CompletedModal;
