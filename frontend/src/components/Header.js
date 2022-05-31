import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


const Header = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);

    let username = 'Anon';
    if (isAuthenticated) username = user?.username?.charAt(0)?.toUpperCase() + user?.username?.slice(1);
    return (
        <div className="container text-white py-3 border-bottom">
            <div className="row">
                <div className="col-12 col-md-6">
                    <h1><img src="/static/img/logo.png" alt="logo" height={"50px"} width={"auto"} /></h1>
                </div>
                <div className={`col-12 col-md-6 d-flex align-items-center justify-content-end ${!isAuthenticated ? 'd-none' : ''}`}>
                    <a href="#" className="custom-link mx-3">Welcome, {username}</a>
                    <p className="m-0">Balance: {user?.balance} $HIX</p>    
                    <a href="#" className="custom-link mx-3" onClick={logout}>Logout</a>
                </div>
            </div>
        </div>
    )
}

export default Header;
