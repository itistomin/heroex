import React, { useContext, useState, useEffect } from "react";

import { TOP_OF_WEEK_URL } from '../constants';
import { AuthContext } from "../context/AuthContext";


const TopWeek = ({ topWeek }) => {
    const { user } = useContext(AuthContext);

    return (
        <div className="container bg-primary text-white text-center my-5 py-3">
            <h3>Top of the week</h3>  
            <img src="/cup.png" />
            <table className="table text-white borderless">
                <tbody>
                    {!user?.week?.number 
                    ? <tr><td colSpan={3}>Start a game and see the top footballers</td></tr> 
                    :
                    topWeek.map((item, index) => (
                        <tr  key={`${index}-top-row`}>
                            <td>{index + 1}</td>
                            <td>{item.footballer.name}</td>
                            <td className="cell-top-week-width">{item.perfomance}</td>
                        </tr>    
                    ))
                }
            </tbody>
        </table>
        </div>
    )
}

export default TopWeek;
