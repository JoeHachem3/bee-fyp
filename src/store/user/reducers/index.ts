import { onApiariesChanged, onEmployeesChanged } from '../../../database';
import {
  loginAction,
  logoutAction,
  setApiariesAction,
  setEmployeesAction,
} from '../actions';
import * as types from '../actions/types';
import { UserState } from '../state';

const initialState: UserState = {};

const login = (state: UserState, action: loginAction): UserState => {
  if (action.user.role === 'owner') {
    onEmployeesChanged(action.user.email);
    onApiariesChanged(action.user.email);
  }
  return {
    ...state,
    user: action.user,
  };
};

const logout = (state: UserState, action: logoutAction): UserState => {
  return {};
};

const setApiaries = (
  state: UserState,
  action: setApiariesAction,
): UserState => {
  return {
    ...state,
    user: { ...state.user, apiaries: action.apiaries },
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
    case types.SET_APIARIES:
      return setApiaries(state, action);
    case types.SET_EMPLOYEES:
      return setEmployees(state, action);
    default:
      return state;
  }
};

export default userReducer;
