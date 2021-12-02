import React, { useState } from 'react';
import WelcomeModal from './WelcomeModal';

function Landing() {
    let [welcomeModal, setShowModal] = useState(true);

    const closeModal = () => {
        setShowModal(false)
    }

    return (
        <div>
            <h1> Landing Page </h1>
            { welcomeModal && <WelcomeModal closeModal={closeModal}></WelcomeModal> }
        </div>
    );
}

export default Landing;
