import * as Yup from 'yup';

export const buySellValidation = Yup.object().shape({
    tokens: Yup.number()
        .min(1, 'Amount should be bigger than 0')
})
