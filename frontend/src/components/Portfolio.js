import React, { useContext, useEffect, useState } from "react";

import { PORTFOLIO_URL, TOP_OF_WEEK_URL } from '../constants';
import { AuthContext } from '../context/AuthContext';
import GameWeeks from './GameWeeks';
import TopWeek from "./TopWeek";


const Portfolio = () => {
    const { apiInstance } = useContext(AuthContext);
    const [footballers, setFootballers] = useState([]);
    const [reward, setTopWeekReward] = useState([]);

    useEffect(() => {
        apiInstance.get(PORTFOLIO_URL()).then((response) => setFootballers(response.data));
        apiInstance.get(TOP_OF_WEEK_URL()).then((response) => {
            const data = {};
            const MAX_INDEX = 0.5;
            response.data.forEach((item, index) => {
                data[item.footballer.name] = MAX_INDEX - (index / 10);
            })
            setTopWeekReward(data);
        });
    }, [])

    const accumulateTokens = (accumulator, item) => accumulator + item.amount;
    const accumulateReward = (accumulator, item) => accumulator + item.amount * (reward[item.footballer.name] || 0);
    const accumulateCost = (accumulator, item) => accumulator + item.buy_price * item.amount;
    const accumulateValue = (accumulator, item) => accumulator + item.sell_price * item.amount;
    const accumulatePNL = (accumulator, item) => accumulator + item.buy_price * item.amount - item.sell_price * item.amount;

    return (
        <div className="row mt-4">
            <div className="col-12 col-lg-9">
                <table className="table table-sm text-white">
                    <thead>
                        <tr>
                            <th scope="col">Rank</th>
                            <th scope="col">Name</th>
                            <th scope="col">Tokens</th>
                            <th scope="col">Rewards</th>
                            <th scope="col">Trade price</th>
                            <th scope="col">Start price</th>
                            <th scope="col">Cost</th>
                            <th scope="col">Value</th>
                            <th scope="col">PnL</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {!footballers.length && <tr className="my-2 text-center"><td colSpan="11" className="py-3">Your portfolio is empty!</td></tr>}
                        {footballers.map((item, index) => (
                            <tr className="table-row" key={`${index}-row`}>
                                <td>{index + 1}</td>
                                <td>{item.footballer.name}</td>
                                <td>{item.amount}</td>
                                <td>{item.amount * (reward[item.footballer.name] || 0)}</td>
                                <td>{item.start_price}</td>
                                <td>{item.buy_price}</td>
                                <td>{(item.buy_price * item.amount).toFixed(2)}</td>
                                <td>{(item.sell_price * item.amount).toFixed(2)}</td>
                                <td>{((item.buy_price * item.amount).toFixed(2) - (item.sell_price * item.amount).toFixed(2)).toFixed(2)}</td>
                                <td className="text-end"><button className="btn btn-success">BUY {item.buy_price}</button></td>
                                <td className="text-end"><button className="btn btn-primary">SELL {item.sell_price}</button></td>
                            </tr>
                        ))}
                        <tr>
                            <td></td>
                            <td>TOTAL</td>
                            <td>{footballers.reduce(accumulateTokens, 0)}</td>
                            <td>{footballers.reduce(accumulateReward, 0)} $HIX</td>
                            <td colSpan={2}></td>
                            <td>{footballers.reduce(accumulateCost, 0).toFixed(2)}</td>
                            <td>{footballers.reduce(accumulateValue, 0).toFixed(2)}</td>
                            <td>{footballers.reduce(accumulatePNL, 0).toFixed(2)}</td>
                            <td colSpan={2}></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="col-12 col-lg-3">
                <GameWeeks />
                <TopWeek />
            </div>
        </div>
    )
}

export default Portfolio;
