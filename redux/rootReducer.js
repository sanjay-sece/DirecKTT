// rootReducer.js
import { combineReducers } from 'redux';
import customerAuthReducer from './customerAuthReducer';
import shopOwnerAuthReducer from './shopOwnerAuthReducer';

const rootReducer = combineReducers({
  customerAuth: customerAuthReducer,
  shopOwnerAuth: shopOwnerAuthReducer,
});

export default rootReducer;
