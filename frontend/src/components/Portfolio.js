import React, { useContext, useEffect, useState } from "react";

import { PORTFOLIO_URL, TOP_OF_WEEK_URL } from '../constants';
import { AuthContext } from '../context/AuthContext';
import GameWeeks from './GameWeeks';
import TopWeek from "./TopWeek";
import BuySellModal from "./BuySellModal";


const Portfolio = ({ searchBy }) => {
    const { apiInstance, isAuthenticated } = useContext(AuthContext);
    const [footballers, setFootballers] = useState([]);
    // const [reward, setTopWeekReward] = useState([]);
    const [topWeek, setTopWeek] = useState([]);
    const [modalData, openModal] = useState([]);

    const updateAll = () => {
        apiInstance.get(PORTFOLIO_URL()).then((response) => setFootballers(response.data));
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
    useEffect(updateAll, [isAuthenticated])

    const display = searchBy === '' ? footballers : footballers.filter((item) => (
        item.name.toLowerCase().includes(searchBy.toLowerCase()) 
    ))

    const accumulateTokens = (accumulator, item) => accumulator + item.amount;
    const accumulateCost = (accumulator, item) => accumulator + item.cost;
    const accumulateValue = (accumulator, item) => accumulator + item.sell_price * item.amount;

    const totalPnL = footballers.reduce((accumulator, item) => accumulator + item.pnl, 0).toFixed(2)
    const totalReward = footballers.reduce((accumulator, item) => accumulator + item._total_reward, 0).toFixed(2)

    return (
        <div className="row mt-4">
            {modalData?.operation && <BuySellModal {...modalData} />}
            <div className="col-12 col-lg-9">
                <table className="table table-sm text-white">
                    <thead>
                        <tr>
                            <th scope="col">Price<br />rank</th>
                            <th scope="col"></th>

                            <th scope="col">Name</th>
                            <th scope="col">Tokens</th>
                            <th scope="col">Rewards</th>

                            <th scope="col">Trade price</th>
                            <th scope="col">Buy price</th>
                            
                            <th scope="col">Cost</th>
                            <th scope="col">Value</th>
                            <th scope="col">P/L</th>
                            
                            <th scope="col" colSpan={2}>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!display.length && <tr className="my-2 text-center"><td colSpan="11" className="py-3">Your portfolio is empty!</td></tr>}
                        {display.map((item, index) => (
                            <tr className="table-row align-middle" key={`${index}-row`}>
                                <td>{item.rank}</td>
                                <td><img src="/static/img/icon.png" alt="icon" width={"40px"} height={"40px"} /></td>

                                <td>{item.name}</td>
                                <td>{item.amount}</td>
                                <td>{item.reward.toFixed(2)}</td>

                                <td>{item.trade_price.toFixed(2)}</td>
                                <td>{item.buy_price.toFixed(2)}</td>

                                <td>{item.cost.toFixed(2)}</td>
                                <td>{item.value.toFixed(2)}</td>
                                <td className={`px-3 ${item.pnl > 0 ? 'green-11-color' : 'purple-color'}`}>{item.pnl.toFixed(2)}</td>
                                <td className="text-end">
                                    <button className="btn purple-bg text-white small-text" onClick={() => processSell({ name: item.name, price: item.sell_price })}>
                                        {item.sell_price.toFixed(2)}<br />SELL
                                    </button>
                                </td>
                                <td className="text-end">
                                    <button className="btn green-11-bg text-white small-text" onClick={() => processBuy({ name: item.name, price: item.buy_price })}>
                                        {item.buy_price.toFixed(2)}<br />BUY
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={3}>TOTAL</td>
                            <td>{footballers.reduce(accumulateTokens, 0)}</td>
                            <td>{totalReward} HIX</td>
                            <td colSpan={2}></td>
                            <td>{footballers.reduce(accumulateCost, 0).toFixed(2)}</td>
                            <td>{footballers.reduce(accumulateValue, 0).toFixed(2)}</td>
                            <td className={`px-3 ${totalPnL > 0 ? 'green-11-color' : 'purple-color'}`}>{totalPnL}</td>
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
