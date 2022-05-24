import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
    const historyLocation = useLocation();
    const [location, updateLocation] = useState(document.location.pathname);
    
    useEffect(() => {
        updateLocation(document.location.pathname);
    }, [historyLocation])
    
    
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
            <li className="nav-item">
                <Link className={`nav-link custom-link disabled ${location == '/gameweek' ? 'custom-link-active' : ''}`} to="#">
                    <i className="fa-solid fa-calendar px-2"></i>
                    Game weeks
                </Link>
            </li>
            <li className="nav-item">
                <Link className={`nav-link custom-link ${location == '/portfolio' ? 'custom-link-active' : ''}`} to="/portfolio">
                    <i className="fa-solid fa-suitcase px-2"></i>
                    Portfolio
                </Link>
            </li>
        </ul>
    )
}

export default Navigation;
