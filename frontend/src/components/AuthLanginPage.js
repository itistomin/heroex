import React, { useContext } from 'react';
import { useFormik } from 'formik';

import { AuthContext } from '../context/AuthContext';
import '../styles/auth_landing.css';


const AuthLandingPage = () => {
    const { login } = useContext(AuthContext);

    const formik = useFormik({
        initialValues: {email: '', password: ''},
        onSubmit: (values) => login(values),
    });

    return (
        <div className="container text-white">
            <div className="row full-screen-block">
                <div className="col-12 col-md-6 middle-alignment">
                    <h1>Welcome to Hero<strong>Ex</strong>!</h1>
                    <small>Demo version of crypto wallet</small>
                </div>

                <div className="col-12 col-md-6 middle-alignment">
                    <div className="text-center">
                        <p className="text-end m-auto w-75">Login to Your waller</p>
                        
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
                </div>
            </div>
        </div>
    )
}

export default AuthLandingPage;