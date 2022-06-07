import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';

import { AuthContext } from '../context/AuthContext';
import { BUY_TOKENS_URL, SELL_TOKENS_URL } from '../constants';
import { buySellValidation } from '../validators';
import { searchUserFootballer } from '../helpers/searchUserFootballer';


const BuySellModal = ({operation, name, price, closeModal, callable}) => {
    const DONE_TEXT = {sell: 'sold', buy: 'bought'}
    const TRANSACTION_FLOW = [operation, 'confirm', DONE_TEXT[operation]];

    const { user, isAuthenticated, apiInstance, getUserData } = useContext(AuthContext);

    const [step, setTransactionStep] = useState(TRANSACTION_FLOW[0]);

    const formik = useFormik({
        initialValues: {footballer: name, tokens: 1},
        validationSchema: buySellValidation,
        onSubmit: (values) => {
            if (step !== TRANSACTION_FLOW[2]) return;
            const url = operation === 'buy' ? BUY_TOKENS_URL() : SELL_TOKENS_URL();
            apiInstance.post(url, values).then(() => {nextTransactionStep})
        }
    });
    const userFootballerTokens = searchUserFootballer(user.footballers, name);

    const notEnoughtTokens = operation === 'sell' && userFootballerTokens < formik.values.tokens ;
    const notEnoughtBallance = operation === 'buy' &&  user?.balance < formik.values.tokens * price;
    const formikErrors = Object.keys(formik.errors).length;

    const purchaseButtonDisabled = notEnoughtTokens || notEnoughtBallance || formikErrors || !isAuthenticated;

    const nextTransactionStep = () => {
        const index = TRANSACTION_FLOW.findIndex((item) => item === step);
        if (index === 2) {
            closeModal(); 
            callable(); 
            getUserData();
        } else {
            setTransactionStep(TRANSACTION_FLOW[index + 1]);
        }
    }

    const TokenInfo = step == TRANSACTION_FLOW[0] 
    ? (
        <div className="col-6 my-2">
            <input
                type="number"
                name="tokens"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.tokens}
                placeholder="Amount of tokens"
            />
            { notEnoughtBallance&& <small className="text-warning">Insufficient Funds</small>}
            { notEnoughtTokens &&  <small className="text-warning">{userFootballerTokens === 0 ? 'Insufficient Tokens' : 'Incorrect amount of tokens'}</small>}
            {  !!formikErrors && <small className="text-warning">{formik.errors.tokens}</small>}
        </div>
    ) : (
        <div className="col-6 my-2">
            {formik.values.tokens}
        </div>
    )

    const ButtonConfirm = step == TRANSACTION_FLOW[1] ?
    (
        <button type="button" className={`btn ${step == operation ? `${operation}-bg` : 'cornflower-blue-bg'} text-white mx-2 ${purchaseButtonDisabled ? 'disabled' : '' }`} onClick={nextTransactionStep}>Confirm</button>
    ) : (
        <button type="submit" className={`btn ${operation === step ? `${operation}-bg` : 'cornflower-blue-bg'} text-white mx-2 ${purchaseButtonDisabled ? 'disabled' : '' }`} onClick={nextTransactionStep}>OK</button>
    );

    return (
        <div className="transaction-background">
            <div className={`transaction-block ${step === operation ? `${operation}-border` : 'cornflower-blue-border'}`}>
                <h3 className={`text-center py-2 w-100 text-white ${step === operation ? `${operation}-bg` : 'cornflower-blue-bg'}`}>
                    {step === operation ? `${step.toUpperCase()} NOW` : 'HeroEx Wallet'}
                </h3>
                <hr />
                <form onSubmit={formik.handleSubmit} className="container">
                    <div className="row">
                        <div className="col-6 my-2 cornflower-blue-color">{step.toUpperCase()} {step === 'confirm' ? operation.toUpperCase() : ''}</div>
                        <div className="col-6 my-2">{name}</div>
                        <div className="col-6 my-2">Your balance:</div>
                        <div className="col-6 my-2">{user?.balance} HIX</div>
                        
                        <div className="col-6 my-2">{operation.toUpperCase()} price:</div>
                        <div className="col-6 my-2">{price} HIX / token</div>

                        {operation === 'sell' && (
                            <>
                                <div className="col-6 my-2">Your tokens:</div>
                                <div className="col-6 my-2">{userFootballerTokens} token</div>
                            </>
                        )}
                        
                        <div className="col-6 my-2">Tokens to {operation === 'buy' ? 'purchase:' : 'sell:'}</div>
                        {TokenInfo}

                        <div className="col-6 my-2">Total {operation === 'buy' ? "Cost" : "Value"}:</div>
                        <div className="col-6 my-2">{(formik.values.tokens * price).toFixed(2)} HIX</div>

                        {step === TRANSACTION_FLOW[2] ? <div className="col-12"><h2 className='cornflower-blue-color text-white text-center'>TRANSACTION CONFIRMED</h2></div> : ''}
                        <div className="col-12 d-flex justify-content-center my-2">
                           {ButtonConfirm}
                            {step === TRANSACTION_FLOW[2] ? "" : <button type="button" className={`btn btn-danger mx-2 ${isAuthenticated ? '' : 'disabled'}` }onClick={closeModal}>Cancel</button>}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BuySellModal;
