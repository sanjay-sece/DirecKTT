// customerAuthActions.js
export const setCustomerToken = (token) => {
    return { type: 'SET_CUSTOMER_TOKEN', payload: token };
  };
  
  export const clearCustomerToken = () => {
    return { type: 'CLEAR_CUSTOMER_TOKEN' };
  };
  