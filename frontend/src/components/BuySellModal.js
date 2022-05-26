import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';

import { AuthContext } from '../context/AuthContext';
import { BUY_TOKENS_URL, SELL_TOKENS_URL } from '../constants';
import { buySellValidation } from '../validators';


const BuySellModal = ({operation, name, price, closeModal}) => {
    const { user, apiInstance } = useContext(AuthContext);
    
    const formik = useFormik({
        initialValues: {footballer: name, tokens: 1},
        validationSchema: buySellValidation,
        onSubmit: (values) => {
            const url = operation === 'buy' ? BUY_TOKENS_URL() : SELL_TOKENS_URL();
            apiInstance.post(url, values).then(closeModal)
        }
    });

    const title = operation.charAt(0).toUpperCase() + operation.slice(1);

    return (
        <div className="transaction-background">
            <div className="transaction-block">
                <h3 className="text-center py-2">{title} <span className="text-success">{name}</span></h3>
                <hr />
                <form onSubmit={formik.handleSubmit} className="container">
                    <div className="row">
                        <div className="col-6 my-2">Your balance:</div>
                        <div className="col-6 my-2">{user?.balance} $HIX</div>
                        
                        <div className="col-6 my-2">Current price:</div>
                        <div className="col-6 my-2">{price.toFixed(2)} $HIX / token</div>
                        
                        <div className="col-6 my-2">Tokens to purchase:</div>
                        <div className="col-6 my-2">
                            <input
                                type="number"
                                name="tokens"
                                className="form-control"
                                onChange={formik.handleChange}
                                value={formik.values.tokens}
                                placeholder="Amount of tokens"
                            />
                            { user?.balance < formik.values.tokens * price && <small className="text-warning">Not enought money</small>}
                            {  formik.errors && <small className="text-warning">{formik.errors.tokens}</small>}
                        </div>

                        <div className="col-6 my-2">Total cost:</div>
                        <div className="col-6 my-2">{(formik.values.tokens * price).toFixed(2)} $HIX</div>

                        <div className="col-12 d-flex justify-content-center my-2">
                            <button type="submit" className={`btn btn-success mx-2 ${ user?.balance < formik.values.tokens * price || formik.errors.tokens ? 'disabled' : '' }`}>Confirm</button>
                            <button type="button" className="btn btn-danger mx-2" onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BuySellModal;
