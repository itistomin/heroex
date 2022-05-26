import React, { useContext, useEffect, useState } from "react";

import { MARKET_URL, TOP_OF_WEEK_URL } from '../constants';
import { AuthContext } from '../context/AuthContext';
import GameWeeks from './GameWeeks';
import TopWeek from "./TopWeek";
import BuySellModal from "./BuySellModal";


const Market = () => {
    const { apiInstance } = useContext(AuthContext);
    const [footballers, setFootballers] = useState([]);
    const [topWeek, setTopWeek] = useState([]);
    const [modalData, openModal] = useState({});

    const updateAll = () => {
        apiInstance.get(MARKET_URL()).then((response) => setFootballers(response.data));
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
                            <th scope="col">Team</th>
                            <th scope="col">Position</th>
                            <th scope="col">Dynamic</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {footballers.map((item, index) => (
                            <tr className="table-row" key={`${index}-row`}>
                                <td>{index + 1}</td>
                                <td>{item.footballer.name}</td>
                                <td>{item.footballer.team.name}</td>
                                <td>{item.footballer.position.name.toUpperCase()}</td>
                                <td className={item.footballer.price_dynamic > 0 ? 'text-warning' : 'text-danger'}>{item.footballer.price_dynamic}</td>
                                <td className="text-end"><button className="btn btn-success" onClick={() => openModal({operation: 'buy', name: item.footballer.name, price: item.buy_price, closeModal: openModal})}>BUY {item.buy_price.toFixed(2)}</button></td>
                                <td className="text-end"><button className="btn btn-primary" onClick={() => openModal({operation: 'sell', name: item.footballer.name, price: item.sell_price, closeModal: openModal})}>SELL {item.sell_price.toFixed(2)}</button></td>
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

export default Market;
