import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from "react-router-dom";
import { PORTFOLIO_URL } from '../constants';
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
    const historyLocation = useLocation();
    const [location, updateLocation] = useState(document.location.pathname);
    const [footballers, setFootballers] = useState([]);
    const { apiInstance, isAuthenticated } = useContext(AuthContext);

    const updateAll = () => {
        if (!isAuthenticated) return;
        apiInstance.get(PORTFOLIO_URL()).then((response) => setFootballers(response.data));
    }
    const accumulateValue = (accumulator, item) => accumulator + item.sell_price * item.amount;

    useEffect(() => {
        updateLocation(document.location.pathname);
    }, [historyLocation]);

    useEffect(updateAll, [isAuthenticated]);
    useEffect(updateAll, []);

    return (
        <ul className="nav nav-pills nav-fill">
            <li className="nav-item">
                <Link className={`nav-link custom-link ${location == '/market' ? 'custom-link-active' : ''}`}  to="/market">
                    <i className="fa-solid fa-cart-shopping px-2"></i>
                    Markets
                </Link>
            </li>
            <li className="nav-item">
                <Link className={`nav-link custom-link ${location == '/points' ? 'custom-link-active' : ''}`} to="/points">
                    <i className="fa-solid fa-star px-2"></i>
                    Match points
                </Link>
            </li>
            <li className="nav-item" data-toggle="tooltip" data-placement="bottom" title="A list of Performance Podium Winners week by week ">
                <Link className={`nav-link custom-link disabled ${location == '/gameweek' ? 'custom-link-active' : ''}`} to="#">
                    <i className="fa-solid fa-calendar px-2"></i>
                    Game weeks
                </Link>
            </li>
            <li className="nav-item">
                <Link className={`nav-link custom-link ${location == '/portfolio' ? 'custom-link-active' : ''}`} to="/portfolio">
                    <i className="fa-solid fa-suitcase px-2"></i>
                    Portfolio&nbsp; <span className="dark-cornflower-blue-3-bg light-blue-color p-1 rounded">HIX {footballers.reduce(accumulateValue, 0).toFixed(2)}</span>
                </Link>
            </li>
            <li className="nav-item"  data-toggle="tooltip" data-placement="bottom" title="Links to Academy, Blogs, forum and other ">
                <Link className={`nav-link custom-link disabled ${location == '/more' ? 'custom-link-active' : ''}`} to="/portfolio">
                    <i class="fa-solid fa-ellipsis px-2"></i>
                    More
                </Link>
            </li>
            <li className="nav-item"   data-toggle="tooltip" data-placement="bottom" title="This describes how a User can fund his Wallet ">
                <Link className={`nav-link custom-link disabled dark-cornflower-blue-3-bg text-white bordered ${location == '/fund' ? 'custom-link-active' : ''}`} to="/portfolio">
                    Fund
                </Link>
            </li>
            <li className="nav-item">
                <Link className={`nav-link custom-link disabled ${location == '/account' ? 'custom-link-active' : ''}`} to="/portfolio">
                <i class="fa-solid fa-user px-2"></i>
                </Link>
            </li>
        </ul>
    )
}

export default Navigation;
