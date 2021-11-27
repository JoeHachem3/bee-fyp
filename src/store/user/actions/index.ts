import { BeeHiveModel, UserModel } from '../../../database/models';
import * as types from './types';

export interface loginAction {
  type: string;
  user: UserModel;
  expirationTime: number;
}

export interface logoutAction {
  type: string;
}

export interface setBeeHivesAction {
  type: string;
  beeHives: BeeHiveModel[];
}

export interface setEmployeesAction {
  type: string;
  employees: UserModel[];
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

export const setBeeHives = (beeHives: BeeHiveModel[]): setBeeHivesAction => {
  return {
    type: types.SET_BEE_HIVES,
    beeHives,
  };
};

export const setEmployees = (employees: UserModel[]): setEmployeesAction => {
  return {
    type: types.SET_EMPLOYEES,
    employees,
  };
};
