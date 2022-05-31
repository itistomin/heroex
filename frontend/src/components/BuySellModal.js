import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';

import { AuthContext } from '../context/AuthContext';
import { BUY_TOKENS_URL, SELL_TOKENS_URL } from '../constants';
import { buySellValidation } from '../validators';
import { searchUserFootballer } from '../helpers/searchUserFootballer';


const BuySellModal = ({operation, name, price, closeModal, callable}) => {
    const { user, isAuthenticated, apiInstance, getUserData } = useContext(AuthContext);
    
    const formik = useFormik({
        initialValues: {footballer: name, tokens: 1},
        validationSchema: buySellValidation,
        onSubmit: (values) => {
            const url = operation === 'buy' ? BUY_TOKENS_URL() : SELL_TOKENS_URL();
            apiInstance.post(url, values).then(() => {closeModal(); callable(); getUserData();})
        }
    });
    const title = operation.charAt(0).toUpperCase() + operation.slice(1);
    const userFootballerTokens = searchUserFootballer(user.footballers, name);
    
    const notEnoughtTokens = operation === 'sell' && userFootballerTokens < formik.values.tokens ;
    const notEnoughtBallance = operation === 'buy' &&  user?.balance < formik.values.tokens * price;
    const formikErrors = Object.keys(formik.errors).length;

    const purchaseButtonDisabled = notEnoughtTokens || notEnoughtBallance || formikErrors || !isAuthenticated;

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
                        <div className="col-6 my-2">{price} $HIX / token</div>

                        {operation === 'sell' && (
                            <>
                                <div className="col-6 my-2">Your tokens:</div>
                                <div className="col-6 my-2">{userFootballerTokens} token</div>
                            </>
                        )}
                        
                        <div className="col-6 my-2">Tokens to {operation === 'buy' ? 'purchase:' : 'sell:'}</div>
                        <div className="col-6 my-2">
                            <input
                                type="number"
                                name="tokens"
                                className="form-control"
                                onChange={formik.handleChange}
                                value={formik.values.tokens}
                                placeholder="Amount of tokens"
                            />
                            { notEnoughtBallance&& <small className="text-warning">Not enought money</small>}
                            { notEnoughtTokens &&  <small className="text-warning">{userFootballerTokens === 0 ? 'You have nothing to sell' : 'Incorrect amount of tokens'}</small>}
                            {  !!formikErrors && <small className="text-warning">{formik.errors.tokens}</small>}
                        </div>

                        <div className="col-6 my-2">Total cost:</div>
                        <div className="col-6 my-2">{(formik.values.tokens * price).toFixed(2)} $HIX</div>

                        <div className="col-12 d-flex justify-content-center my-2">
                            <button type="submit" className={`btn btn-success mx-2 ${purchaseButtonDisabled ? 'disabled' : '' }`}>Confirm</button>
                            <button type="button" className={`btn btn-danger mx-2 ${isAuthenticated ? '' : 'disabled'}` }onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BuySellModal;
