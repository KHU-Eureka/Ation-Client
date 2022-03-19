import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import WelcomeModal from './WelcomeModal';
import PersonaCompleteModal from './PersonaCreateCompleteModal';
import LandingCover from './page/LandingCover';
import LandingPage1 from './page/LandingPage1';
import LandingPage2 from './page/LandingPage2';
import './page/LandingPage.css';
import LandingPage3 from './page/LandingPage3';
import LandingPage4 from './page/LandingPage4';
import LandingPage5 from './page/LandingPage5';
import LandingPage6 from './page/LandingPage6';
import LandingEnd from './page/LandingEnd';


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
            <LandingPage1 />
            <LandingPage2 />
            <LandingPage3 />
            <LandingPage4 />
            <LandingPage5 />
            <LandingPage6 />
            <LandingEnd />
        </div>
    );
}

export default Landing;
