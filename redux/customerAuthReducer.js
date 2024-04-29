// customerAuthReducer.js
const initialState = {
    customertoken: "normal",
  };
  
  const customerAuthReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_CUSTOMER_TOKEN':
        return { ...state, customertoken: action.payload };
      case 'CLEAR_CUSTOMER_TOKEN':
        return { ...state, customertoken: null };
      default:
        return state;
    }
  };
  
  export default customerAuthReducer;
  