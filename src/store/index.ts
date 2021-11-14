import { createStore, combineReducers } from 'redux';
import userReducer from './user/reducers';
import preferenceReducer from './preferences/reducers';

const rootReducer = combineReducers({
  userReducer,
  preferenceReducer,
});

const store = createStore(rootReducer);

export default store;
