import React, { useContext, useEffect, useState } from "react";

import { MARKET_URL, TOP_OF_WEEK_URL } from '../constants';
import { AuthContext } from '../context/AuthContext';
import GameWeeks from './GameWeeks';
import TopWeek from "./TopWeek";
import BuySellModal from "./BuySellModal";


const Market = ({ searchBy }) => {
    const { apiInstance, isAuthenticated, user } = useContext(AuthContext);
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

    const display = footballers;

    useEffect(updateAll, [])

    return (
        <div className="row mt-4">
            {modalData?.operation && <BuySellModal {...modalData} />}
            <div className="col-12 col-lg-9">
                <table className="table table-sm text-white text-center">
                    <tbody>
                        <tr className="text-center">
                            <td scope="col">Rank</td>
                            <td scope="col"></td>
                            <td scope="col" className="text-start">Name</td>
                            <td scope="col" className="text-start">Team</td>
                            <td scope="col">Position</td>
                            <td scope="col">7Day</td>
                            <td scope="col"></td>
                            <td scope="col"></td>
                        </tr>
                        {display.map((item, index) => (
                            <tr className="table-row align-middle" key={`${index}-row`}>
                                <td>{item.rank}</td>
                                <td><img src="/static/img/icon.png" alt="icon" width={"40px"} height={"40px"} /></td>
                                <td data-toggle="tooltip" data-placement="bottom" title="Links to Player Profile Page with stats, biog, price and performance charts" className="text-start">{item.footballer.name}</td>
                                <td className="text-start">{item.footballer.team.name}</td>
                                <td>{item.footballer.position.name.toUpperCase()}</td>
                                <td className={item.footballer.price_dynamic > 0 ? 'dynamic-positive' : 'dynamic-negative'}>{item.footballer.price_dynamic} ({(item.footballer.price_dynamic * 100 / item.buy_price).toFixed(2)} %)</td>
                                <td className="text-end">
                                    <button 
                                        className={`${user?.week?.number === 8 && 'disabled'} btn purple-bg text-white small-text ${isAuthenticated ? '' : 'd-none'}`}
                                        onClick={() => processSell({name: item.footballer.name, price: item.sell_price})}
                                    >
                                            {item.sell_price.toFixed(2)}<br />SELL
                                        </button>
                                </td>
                                <td className="text-end">
                                    <button
                                        className={`${user?.week?.number === 8 && 'disabled'} btn green-11-bg text-white small-text ${isAuthenticated ? '' : 'd-none'}`}
                                        onClick={() => processBuy({name: item.footballer.name, price: item.buy_price})}
                                    >
                                            {item.buy_price.toFixed(2)}<br />BUY
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

export default Market;
