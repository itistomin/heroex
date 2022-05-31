import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';

import { AuthContext } from '../context/AuthContext';
import '../styles/auth_landing.css';


const AuthLandingPage = () => {
    const { login } = useContext(AuthContext);
    const [authOpened, openAuthModal] = useState(false);

    const formik = useFormik({
        initialValues: {email: '', password: ''},
        onSubmit: (values) => login(values),
    });

    const openAuth = () => openAuthModal(true);

    if (!authOpened) {
        return (
            <div className="auth-block">
                <button className="button login-button" onClick={openAuth}>Click to connect Wallet</button>
            </div>
        )
    }

    return (
        <div className="auth-block auth-background">
            <div className="welcome-line text-white text-center w-100 cornflower-blue-bg">
                <p className="">Welcome to HeroEx Wallet</p>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <input 
                        className="form-control w-75 m-auto my-3"
                        name="email" 
                        type="email" 
                        onChange={formik.handleChange} 
                        value={formik.values.email} 
                        placeholder="Email"
                    />
                    <input 
                        className="form-control w-75 m-auto my-3"
                        name="password" 
                        type="password" 
                        onChange={formik.handleChange} 
                        value={formik.values.password} 
                        placeholder="Password"
                    />
                </div>
                <div className="w-75 m-auto text-end">
                    <button type="submit" className="btn btn-success">Login</button>
                </div>
            </form>
            <div className="text-end w-75 m-auto mt-5">
                <p className="helper-text">Forgot your password?<br /> Email here: team@hero-dao.com</p>
            </div>
        </div>  
    )
}

export default AuthLandingPage;