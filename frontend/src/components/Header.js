import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


const Header = () => {
    const { isAuthenticated, user, login, logout } = useContext(AuthContext);

    return (
        <div className="container text-white py-3">
            <div className="row">
                <div className="col-12 col-md-6">
                    <h1>HeroEx</h1>
                </div>
            </div>
        </div>
    )
}

export default Header;
