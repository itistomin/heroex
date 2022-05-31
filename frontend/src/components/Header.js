import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useFormik } from 'formik';


const Header = ({ setSearchBy }) => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const formik = useFormik({
        initialValues: {search: ''},
        onSubmit: (values) => {
            setSearchBy(values.search)
        }
    })

    const applySearch = () => {
        setSearchBy(formik.values.search)
    }

    let username = 'Anon';
    if (isAuthenticated) username = user?.username?.charAt(0)?.toUpperCase() + user?.username?.slice(1);
    return (
        <div className="container text-white py-3 border-bottom">
            <div className="row">
                <div className="col-12 col-md-3">
                    <h1><img src="/static/img/logo.png" alt="logo" height={"50px"} width={"auto"} /></h1>
                </div>
                <div class="col-12 col-md-4 d-flex align-items-center">
                    <form onSubmit={formik.handleSubmit} className="d-flex">
                        <input type="text" name="search" className="form-control" placeholder="Search footballer"value={formik.values.search} onChange={formik.handleChange} />
                        <button class="btn btn-light" onClick={applySearch} ><i class="fa-solid fa-magnifying-glass"></i></button>
                    </form>
                </div>
                <div className={`col-12 col-md-5 d-flex align-items-center justify-content-end ${!isAuthenticated ? 'd-none' : ''}`}>
                    <div className="row">
                        <div className="col">
                            <p className="m-0">Balance: </p>    
                            <p>{user?.balance} $HIX</p>
                        </div>
                        <div className="col">
                            <a href="#" className="custom-link mx-3">Hi, random</a><img src="https://countryflagsapi.com/svg/826" height={"15px"} width={"auto"} />
                            <a href="#" className="custom-link mx-3" onClick={logout}>Logout</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;
