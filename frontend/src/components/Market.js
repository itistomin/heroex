import React, { useContext, useEffect, useState } from "react";

import { MARKET_URL, TOP_OF_WEEK_URL } from '../constants';
import { AuthContext } from '../context/AuthContext';
import GameWeeks from './GameWeeks';
import TopWeek from "./TopWeek";
import BuySellModal from "./BuySellModal";


const Market = ({ searchBy }) => {
    const { apiInstance, isAuthenticated } = useContext(AuthContext);
    const [footballers, setFootballers] = useState([]);
    const [topWeek, setTopWeek] = useState([]);
    const [modalData, openModal] = useState({});

    const updateAll = () => {
        apiInstance.get(MARKET_URL()).then((response) => setFootballers(response.data));
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

    const display = searchBy === '' ? footballers : footballers.filter((item) => (
        item.footballer.name.toLowerCase().includes(searchBy.toLowerCase()) 
        || item.footballer.team.name.toLowerCase().includes(searchBy.toLowerCase())
    ))

    useEffect(updateAll, [])

    return (
        <div className="row mt-4">
            {modalData?.operation && <BuySellModal {...modalData} />}
            <div className="col-12 col-lg-9">
                <table className="table table-sm text-white">
                    <thead>
                        <tr>
                            <th scope="col">Rank</th>
                            <th scope="col"></th>
                            <th scope="col">Name</th>
                            <th scope="col">Team</th>
                            <th scope="col">Position</th>
                            <th scope="col">7Day</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {display.map((item, index) => (
                            <tr className="table-row align-middle" key={`${index}-row`}>
                                <td>{item.rank}</td>
                                <td><img src="/static/img/icon.png" alt="icon" width={"40px"} height={"40px"} /></td>
                                <td>{item.footballer.name}</td>
                                <td>{item.footballer.team.name}</td>
                                <td>{item.footballer.position.name.toUpperCase()}</td>
                                <td className={item.footballer.price_dynamic > 0 ? 'dynamic-positive' : 'dynamic-negative'}>{item.footballer.price_dynamic} ({(item.footballer.price_dynamic * 100 / item.buy_price).toFixed(2)} %)</td>
                                <td className="text-end"><button className={`btn purple-bg text-white ${isAuthenticated ? '' : 'd-none'}`} onClick={() => processSell({name: item.footballer.name, price: item.sell_price})}>SELL {item.sell_price.toFixed(2)}</button></td>
                                <td className="text-end"><button className={`btn green-11-bg text-white ${isAuthenticated ? '' : 'd-none'}`} onClick={() => processBuy({name: item.footballer.name, price: item.buy_price})}>BUY {item.buy_price.toFixed(2)}</button></td>
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
