import React, { useContext, useEffect, useState } from "react";

import { MATCH_POINTS_URL, TOP_OF_WEEK_URL } from '../constants';
import { AuthContext } from '../context/AuthContext';
import GameWeeks from './GameWeeks';
import TopWeek from "./TopWeek";
import BuySellModal from "./BuySellModal";


const MatchPoints = () => {
    const { apiInstance } = useContext(AuthContext);
    const [footballers, setFootballers] = useState([]);
    const [topWeek, setTopWeek] = useState([]);
    const [modalData, openModal] = useState([]);

    const updateAll = () => {
        apiInstance.get(MATCH_POINTS_URL()).then((response) => setFootballers(response.data));
        apiInstance.get(TOP_OF_WEEK_URL()).then((response) => setTopWeek(response.data));
    }

    useEffect(updateAll, [])

    return (
        <div className="row mt-4">
            {modalData?.operation && <BuySellModal {...modalData} />}
            <div className="col-12 col-lg-9">
                <table className="table table-sm text-white">
                    <thead>
                        <tr>
                            <th scope="col">Rank</th>
                            <th scope="col">Name</th>
                            <th scope="col">Total Points</th>
                            <th scope="col">Previous week</th>
                            <th scope="col">Current week</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(footballers).map((key, index) => (
                            <tr className="table-row" key={`${index}-row`}>
                                <td>{index + 1}</td>
                                <td>{key}</td>
                                <td>{footballers[key].total_score}</td>
                                <td>{footballers[key].previous_score}</td>
                                <td>{footballers[key].current_score}</td>
                                <td className="text-end"><button className="btn btn-success" onClick={() => openModal({ operation: 'buy', name: key, price: footballers[key].buy_price, closeModal: openModal })}>BUY {footballers[key].buy_price.toFixed(2)}</button></td>
                                <td className="text-end"><button className="btn btn-primary" onClick={() => openModal({ operation: 'sell', name: key, price: footballers[key].sell_price, closeModal: openModal })}>SELL {footballers[key].sell_price.toFixed(2)}</button></td>
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
