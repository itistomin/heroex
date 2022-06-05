import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "../context/AuthContext";

import { RESET_WEEK_URL, NEXT_WEEK_URL, GAME_WEEK_RESULT_URL } from '../constants';
import EndGame from "./EndGame";


const GameWeeks = ({callable}) => {
    const { user, apiInstance, getUserData } = useContext(AuthContext);
    const [modalData, setModalData] = useState( false );


    const resetGameWeek = () => {
        apiInstance.post(RESET_WEEK_URL()).then(
            () => {
                callable();
                getUserData();
            }
        );
    }

    const goToNextWeek = () => {
        if (user?.week?.number == 8 ) return;
        apiInstance.post(NEXT_WEEK_URL()).then(
            () => {
                callable();
                getUserData();
            }
        )
    }

    return (
         <div className="container dark-purple-3-bg dark-cornflower-blue-3-border text-white text-center py-3">
            {modalData && <EndGame {...{closeModal: setModalData}} />}
            <h3>Lets Get Started!</h3>  
            <p>You have 500 HIX to spend buying footballers. When you have your players click the button below to play</p>
            <div className="d-flex justify-content-around">
                <h4 className="m-1">Week { user?.week?.number || 0}</h4>
                {user?.week?.number !== 8 ? <button className="btn cornflower-blue-bg text-white" onClick={goToNextWeek}>Next week <i className="fa-solid fa-angles-right"></i></button> : <button className="btn cornflower-blue-bg text-white p-1" onClick={() => setModalData(true)}>Finish Game<br />See Result</button>}
            </div>
            <p>Each time you click it advances the game on one ‘Play Week’. There are 8 Play weeks.</p>
            <p>See if you can maximise your gains over the 8 Play Weeks!</p>
            <button className="btn btn-danger" onClick={resetGameWeek}>Reset game</button>
        </div>
    )
}

export default GameWeeks;
