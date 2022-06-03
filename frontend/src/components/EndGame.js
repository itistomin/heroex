import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { GAME_WEEK_RESULT_URL } from "../constants";

const EndGame = ({ closeModal }) => {
    const [data, setData] = useState({});
    const { apiInstance, isAuthenticated  } = useContext(AuthContext);

    const fetchGameResults = () => {
        // apiInstance.get(GAME_WEEK_RESULT_URL()).then((responce) => setData(responce.data));
    }

    useEffect(fetchGameResults, [isAuthenticated]);

    return (
        <div className="transaction-background">
            <div className='transaction-block cornflower-blue-border'>
                <h3 className='text-center py-2 w-100 text-white cornflower-blue-bg'>HeroEx Wallet</h3>
                <div className="row">
                    <div className="col-3">
                        <img src="/static/img/surprise.png" alt="surprize" className="w-75" />
                    </div>
                    <div className="col bigger-text">
                        <span className="cornflower-blue-color">CONGRATULATIONS!!</span><br />
                        Heres how you did:
                    </div>
                    <div className="col-3">
                        <img src="/static/img/surprise.png" alt="surprize" className="w-75" />
                    </div>
                </div>
                <div className="row my-2">
                    <div className="col-6 my-2">Total P&amp;L</div>
                    <div className="col-6 my-2"></div>
                    
                    <div className="col-6 my-2">Total Rewards:</div>
                    <div className="col-6 my-2"></div>

                    <div className="col-6 my-2">Total Return:</div>
                    <div className="col-6 my-2"></div>

                    <div className="col-6 my-2">Leaderboard:</div>
                    <div className="col-6 my-2">Your score ranked 0 out of 0</div>
                </div>
                <div className="col-12 d-flex justify-content-center my-2">
                    <p className="m-0 cornflower-blue-color bigger-text">Thank you for the play</p>
                    <button type="submit" className='btn cornflower-blue-bg text-white mx-2' onClick={() => closeModal(false)}>Ok</button>
                </div>
            </div>
        </div>
    )
}

export default EndGame;
