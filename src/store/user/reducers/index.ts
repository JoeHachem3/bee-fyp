import { loginAction, logoutAction } from '../actions';
import * as types from '../actions/types';
import { UserState } from '../state';

const initialState: UserState = {};

const login = (state: UserState, action: loginAction): UserState => {
  return {
    ...state,
    user: action.user,
  };
};

const logout = (state: UserState, action: logoutAction): UserState => {
  return {};
};

const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case types.LOGIN:
      return login(state, action);
    case types.LOGOUT:
      return logout(state, action);
    default:
      return state;
  }
};

export default userReducer;
