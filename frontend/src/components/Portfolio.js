import React, { useContext, useEffect, useState } from "react";

import { PORTFOLIO_URL, TOP_OF_WEEK_URL } from '../constants';
import { AuthContext } from '../context/AuthContext';
import GameWeeks from './GameWeeks';
import TopWeek from "./TopWeek";
import BuySellModal from "./BuySellModal";


const Portfolio = ({ searchBy, updateIndex }) => {
    const { apiInstance, isAuthenticated, user } = useContext(AuthContext);
    const [footballers, setFootballers] = useState([]);
    const [topWeek, setTopWeek] = useState([]);
    const [modalData, openModal] = useState([]);

    const updateAll = () => {
        apiInstance.get(PORTFOLIO_URL()).then((response) => setFootballers(response.data));
        apiInstance.get(TOP_OF_WEEK_URL()).then((response) => setTopWeek(response.data));
        apiInstance.get('/api/stock/weekindex/').then((response) => updateIndex(response.data))
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
    useEffect(updateAll, [isAuthenticated])

    const display = footballers;

    const accumulateTokens = (accumulator, item) => accumulator + item.amount;
    const accumulateCost = (accumulator, item) => accumulator + item.cost;
    const accumulateValue = (accumulator, item) => accumulator + item.sell_price * item.amount;

    const totalPnL = footballers.reduce((accumulator, item) => accumulator + item.pnl, 0).toFixed(2)
    const totalCost = footballers.reduce(accumulateCost, 0).toFixed(2);

    return (
        <div className="row mt-4">
            {modalData?.operation && <BuySellModal {...modalData} />}
            <div className="col-12 col-lg-9">
                <table className="table table-sm text-white text-center">
                    <tbody>
                        <tr>
                            <td scope="col">Rank</td>

                            <td scope="col" className="text-start">Name</td>
                            <td scope="col">Tokens</td>
                            <td scope="col">Rewards</td>

                            <td scope="col">Trade Price</td>
                            
                            <td scope="col">Cost</td>
                            <td scope="col">Value</td>
                            <td scope="col">P/L</td>
                            
                            <td scope="col" colSpan={2}>Price</td>
                        </tr>
                        {!display.length && <tr className="my-2 text-center"><td colSpan="11" className="py-3">Your portfolio is empty!</td></tr>}
                        {display.map((item, index) => (
                            <tr className="table-row align-middle" key={`${index}-row`}>
                                <td>{item.rank}</td>

                                <td className="text-start">{item.name}</td>
                                <td>{item.amount}</td>
                                <td>{item.reward.toFixed(2)}</td>

                                <td>{item.trade_price.toFixed(2)}</td>

                                <td>{item.cost.toFixed(2)}</td>
                                <td>{item.value.toFixed(2)}</td>
                                <td className={`px-3 ${item.pnl > 0 ? 'green-11-color' : 'purple-color'}`}>{item.pnl.toFixed(2)} ({(item.pnl / item.cost * 100).toFixed(2)}%)</td>
                                <td className="text-end">
                                    <button className={`btn purple-bg text-white small-text ${user?.week?.number === 8 && 'disabled'}`} onClick={() => processSell({ name: item.name, price: item.sell_price })}>
                                        {item.sell_price.toFixed(2)}<br />SELL
                                    </button>
                                </td>
                                <td className="text-end">
                                    <button className={`btn green-11-bg text-white small-text ${user?.week?.number === 8 && 'disabled'}`} onClick={() => processBuy({ name: item.name, price: item.buy_price })}>
                                        {item.buy_price.toFixed(2)}<br />BUY
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={2}>TOTAL</td>
                            <td>{footballers.reduce(accumulateTokens, 0)}</td>
                            <td>{user?.reward} HIX</td>
                            <td colSpan={1}></td>
                            <td>{totalCost}</td>
                            <td>{footballers.reduce(accumulateValue, 0).toFixed(2)}</td>
                            <td className={`px-3 ${totalPnL > 0 ? 'green-11-color' : 'purple-color'}`}>{totalPnL} ({(totalPnL / totalCost * 100 || 0).toFixed(2)}%)</td>
                            <td colSpan={2}></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="col-12 col-lg-3">
                <GameWeeks callable={updateAll} />
                <TopWeek topWeek={topWeek}  />
            </div>
        </div>
    )
}

export default Portfolio;
