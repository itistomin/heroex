import React, { useContext, useEffect, useState } from "react";

import { MATCH_POINTS_URL, TOP_OF_WEEK_URL } from '../constants';
import { AuthContext } from '../context/AuthContext';
import GameWeeks from './GameWeeks';
import TopWeek from "./TopWeek";
import BuySellModal from "./BuySellModal";


const MatchPoints = ({searchBy}) => {
    const { apiInstance, isAuthenticated, user } = useContext(AuthContext);
    const [footballers, setFootballers] = useState([]);
    const [topWeek, setTopWeek] = useState([]);
    const [modalData, openModal] = useState([]);

    const updateAll = () => {
        if (!isAuthenticated) return;
        apiInstance.get(MATCH_POINTS_URL()).then((response) => setFootballers(response.data));
        apiInstance.get(TOP_OF_WEEK_URL()).then((response) => setTopWeek(response.data));
    }

    const transaction = {
        closeModal: openModal,
        callable: updateAll,
    };
    const processBuy = ({name, price}) => {
        openModal({
            ...transaction,
            operation: 'buy',
            name, price,
        })
    }
    const processSell = ({name, price}) => {
        openModal({
            ...transaction,
            operation: 'sell',
            name, price,
        })
    }

    const displayKeys = Object.keys(footballers);
    useEffect(updateAll, [isAuthenticated]);

    return (
        <div className="row mt-4">
            {modalData?.operation && <BuySellModal {...modalData} />}
            <div className="col-12 col-lg-9">
                <table className="table table-sm text-white text-center">
                    <tbody>
                        <tr>
                            <td scope="col">Price rank</td>
                            <td scope="col"></td>
                            <td scope="col">Name</td>
                            <td scope="col">Total Points</td>
                            <td scope="col">Previous week</td>
                            <td scope="col">Current week</td>
                            <td scope="col"></td>
                            <td scope="col"></td>
                        </tr>
                        {displayKeys.map((key, index) => (
                            <tr className="table-row align-middle" key={`${index}-row`}>
                                <td>{footballers[key].rank}</td>
                                <td><img src="/static/img/icon.png" alt="icon" width={"40px"} height={"40px"} /></td>
                                <td>{key}</td>
                                <td>{footballers[key].total_score}</td>
                                <td>{footballers[key].previous_score}</td>
                                <td>{footballers[key].current_score}</td>
                                <td className="text-end">
                                    <button className={`btn purple-bg text-white small-text ${user?.week?.number === 8 && 'disabled'}`} onClick={() => processSell({ name: key, price: footballers[key].sell_price })}>
                                        {footballers[key].sell_price.toFixed(2)}<br />SELL
                                    </button>
                                </td>
                                <td className="text-end">
                                    <button className={`${user?.week?.number === 8 && 'disabled'} btn green-11-bg text-white small-text`} onClick={() => processBuy({ name: key, price: footballers[key].buy_price })}>
                                        {footballers[key].buy_price.toFixed(2)}<br />BUY
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="col-12 col-lg-3">
                <GameWeeks callable={updateAll} />
                <TopWeek topWeek={topWeek} />
            </div>
        </div>
    )
}

export default MatchPoints;
