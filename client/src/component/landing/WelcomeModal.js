import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function WelcomeModal(props) {
    console.log(props);
    const navigation = useNavigate();

    const goToCreatePersona = () => {
        props.closeWelcome();
        navigation('/persona-create')
    }

    return (
        <div className="modal-background">
            <div className="modal-wrapper">
                <div className="modal-header">
                    <div className="close-btn"
                    onClick={ props.closeWelcome }
                    >
                        X
                    </div>
                </div>

                <div className="modal-content">
                    <div className="modal-title">Welcome!</div>
                    <div className="modal-sub-title">
                        { props.name }님 가입을 환영합니다! 지금 바로 페르소나를 생성해보세요!
                    </div>
                    <div className="image">character design image</div>
                    <button
                        onClick={ goToCreatePersona }>
                        페르소나 등록하러 가기
                    </button>
                </div>

                <div className="modal-footer">
                    <div className="modal-description">
                        센세이션은 페르소나로 활동할 수 있는 서비스입니다. <br/>
                        페르소나를 등록하지 않으면 활동 일부에 제한이 있습니다.
                    </div>
                </div>

            </div>

        </div>
    );
}

export default WelcomeModal;
