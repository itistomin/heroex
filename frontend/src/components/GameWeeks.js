import React, { useContext } from "react";

import { AuthContext } from "../context/AuthContext";


const GameWeeks = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="container bg-primary text-white text-center py-3">
            <h3>Lets Get Started!</h3>  
            <p>You have 500 $HIX to spend buying footballers. When you have your players click the button below to play</p>
            <div className="d-flex justify-content-around">
                <h4>Week { user.week.number }</h4>
                <button className="btn btn-success">Next week <i class="fa-solid fa-angles-right"></i></button>
            </div>
            <p>Each time you click it advances the game on one ‘Play Week’. There are 8 Play weeks.</p>
            <p>See if you can maximise your gains over the 8 Play Weeks!</p>
            <button className="btn btn-danger">Reset game</button>
        </div>
    )
}

export default GameWeeks;
