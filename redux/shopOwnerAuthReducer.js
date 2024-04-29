const initialState = {
    shopOwnerToken: "normal",
  };
  
  const shopOwnerAuthReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_SHOP_OWNER_TOKEN':
        return { ...state, shopOwnerToken: action.payload };
      case 'CLEAR_SHOP_OWNER_TOKEN':
        return { ...state, shopOwnerToken: null };
      default:
        return state;
    }
  };
  
  export default shopOwnerAuthReducer;
  