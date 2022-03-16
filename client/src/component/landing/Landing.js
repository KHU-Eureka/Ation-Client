import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import WelcomeModal from './WelcomeModal';
import PersonaCompleteModal from './PersonaCreateCompleteModal';
import LandingCover from './LandingCover';

function Landing() {
    const { state } = useLocation();

    let [welcomeModal, showWelcomeModal] = useState(false);
    let [name, setName] = useState("");
    const closeWelcome = () => {
        console.log('close')
        showWelcomeModal(false);
    }

    let [personaCreateModal, showPersonaCreateModal] = useState(false);

    useEffect(()=> { // state 검사
        if (state != null) {
            // 신규 유저일 때
            if (state.welcome != null) {
                showWelcomeModal(state.welcome)
                setName(state.name)
            } else {
                showWelcomeModal(false)
            }

            // persona 신규 등록을 마친 유저일 때
            showPersonaCreateModal( state.personaCreate != null ? true : false )
        }
    }, [])

    return (
        <div className="landing">
            { welcomeModal && <WelcomeModal closeWelcome={closeWelcome} name={name}></WelcomeModal> }
            { personaCreateModal && <PersonaCompleteModal showPersonaCreateModal={showPersonaCreateModal}></PersonaCompleteModal> }
            <LandingCover />
        </div>
    );
}

export default Landing;
