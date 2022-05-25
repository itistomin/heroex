import React, { useContext, useEffect, useState } from "react";

import { MARKET_URL } from '../constants';
import { AuthContext } from '../context/AuthContext';
import GameWeeks from './GameWeeks';
import TopWeek from "./TopWeek";


const Market = () => {
    const { apiInstance } = useContext(AuthContext);
    const [footballers, setFootballers] = useState([]);

    useEffect(() => {
        apiInstance.get(MARKET_URL()).then((response) => setFootballers(response.data));
    }, [])

    return (
        <div className="row mt-4">
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
                                <td className="text-end"><button className="btn btn-success">BUY {item.buy_price}</button></td>
                                <td className="text-end"><button className="btn btn-primary">SELL {item.sell_price.toFixed(2)}</button></td>
                            </tr>
                        ))}
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

export default Market;
