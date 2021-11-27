import { onBeeHivesChanged, onEmployeesChanged } from '../../../database';
import {
  loginAction,
  logoutAction,
  setBeeHivesAction,
  setEmployeesAction,
} from '../actions';
import * as types from '../actions/types';
import { UserState } from '../state';

const initialState: UserState = {};

const login = (state: UserState, action: loginAction): UserState => {
  onBeeHivesChanged(action.user.email);
  onEmployeesChanged(action.user.email);
  return {
    ...state,
    user: action.user,
  };
};

const logout = (state: UserState, action: logoutAction): UserState => {
  return {};
};

const setBeeHives = (
  state: UserState,
  action: setBeeHivesAction,
): UserState => {
  return {
    ...state,
    user: {
      ...state.user,
      beeHives: action.beeHives,
    },
  };
};

const setEmployees = (
  state: UserState,
  action: setEmployeesAction,
): UserState => {
  return {
    ...state,
    user: {
      ...state.user,
      employees: action.employees,
    },
  };
};

const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case types.LOGIN:
      return login(state, action);
    case types.LOGOUT:
      return logout(state, action);
    case types.SET_BEE_HIVES:
      return setBeeHives(state, action);
    case types.SET_EMPLOYEES:
      return setEmployees(state, action);
    default:
      return state;
  }
};

export default userReducer;
