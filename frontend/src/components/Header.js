import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useFormik } from 'formik';


const Header = ({ setSearchBy, index }) => {
    const { user, isAuthenticated, logout, apiInstance } = useContext(AuthContext);
    const formik = useFormik({
        initialValues: {search: ''},
        onSubmit: (values) => {
            setSearchBy(values.search)
        }
    })

    const updateIndex = () => {
        apiInstance.get('/api/stock/weekindex/').then((response) => setIndex(response.data))
    }

    const applySearch = () => {
        setSearchBy(formik.values.search)
    }

    useEffect(updateIndex, [isAuthenticated]);

    return (
        <div className="container text-white py-3">
            <div className="row">
                <div className="col-12 col-md-3">
                    <h1><img src="/static/img/logo.png" alt="logo" height={"50px"} width={"auto"} /></h1>
                </div>
                <div class="col-12 col-md-3 d-flex align-items-center">
                    <form onSubmit={formik.handleSubmit} className="d-flex">
                        <input type="text" name="search" className="form-control" placeholder="Search footballer" value={formik.values.search} onChange={formik.handleChange} data-toggle="tooltip" data-placement="bottom" title="Intuitive search of all Players by name or team" />
                        <button class="btn btn-light" onClick={applySearch} ><i class="fa-solid fa-magnifying-glass"></i></button>
                    </form>
                </div>
                <div className={`col-12 col-md-6 ${!isAuthenticated ? 'd-none' : ''}`}>
                    <div className="row">
                        <div className='col-3'>
                            <p className="m-0">Hero100</p>
                            <p className="m-0">{index}&nbsp;<span className="green-11-color"></span></p>
                        </div>
                        <div className="col-3">
                            <p className="m-0">HIX Price: </p>
                            <p>1$HIX&nbsp;=&nbsp;1$USDC</p>
                        </div>
                        <div className="col-3">
                            <p className="m-0">Balance: </p>    
                            <p>{user?.balance} HIX</p>
                        </div>
                        <div className="col-3">
                            <a href="#" className="custom-link mx-3">Hi,&nbsp;Joe</a>
                            <br />
                            <a href="#" className="custom-link mx-3" onClick={logout}>Logout</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;
