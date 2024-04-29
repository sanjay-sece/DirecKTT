// shopOwnerAuthActions.js
export const setShopOwnerToken = (token) => {
    return { type: 'SET_SHOP_OWNER_TOKEN', payload: token };
  };
  
  export const clearShopOwnerToken = () => {
    return { type: 'CLEAR_SHOP_OWNER_TOKEN' };
  };
  