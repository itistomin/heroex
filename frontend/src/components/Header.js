import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


const Header = () => {
    const { logout } = useContext(AuthContext);

    return (
        <div className="container text-white py-3">
            <div className="row">
                <div className="col-12 col-md-6">
                    <h1>HeroEx</h1>
                </div>
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-end">
                    <a href="#" className="custom-link" onClick={logout}>Logout</a>
                </div>
            </div>
        </div>
    )
}

export default Header;
