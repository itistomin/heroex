import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


const Header = () => {
    const { user, logout } = useContext(AuthContext);

    const username = user?.username?.charAt(0)?.toUpperCase() + user?.username?.slice(1);

    return (
        <div className="container text-white py-3 border-bottom">
            <div className="row">
                <div className="col-12 col-md-6">
                    <h1>HeroEx</h1>
                </div>
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-end">
                    <a href="#" className="custom-link mx-3">Welcome, {username}</a>
                    <p className="m-0">Balance: {user?.balance} $HIX</p>    
                    <a href="#" className="custom-link mx-3" onClick={logout}>Logout</a>
                </div>
            </div>
        </div>
    )
}

export default Header;
