import {
  ApiaryModel,
  BeeHiveModel,
  EmployeeModel,
  UserModel,
} from '../../../database/models';
import * as types from './types';

export interface loginAction {
  type: string;
  user: UserModel;
  expirationTime: number;
}

export interface logoutAction {
  type: string;
}

export interface setApiariesAction {
  type: string;
  apiaries: { [key: string]: ApiaryModel };
}

export interface setEmployeesAction {
  type: string;
  employees: { [key: string]: EmployeeModel };
}

export const login = (user: UserModel, expirationTime: number): loginAction => {
  return {
    type: types.LOGIN,
    user,
    expirationTime,
  };
};

export const logout = (): logoutAction => {
  return {
    type: types.LOGOUT,
  };
};

export const setApiaries = (apiaries: {
  [key: string]: ApiaryModel;
}): setApiariesAction => {
  return {
    type: types.SET_APIARIES,
    apiaries,
  };
};

export const setEmployees = (employees: {
  [key: string]: EmployeeModel;
}): setEmployeesAction => {
  return {
    type: types.SET_EMPLOYEES,
    employees,
  };
};
