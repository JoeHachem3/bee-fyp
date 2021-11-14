import { UserModel } from '../../../database/models';
import * as types from './types';

export interface loginAction {
  type: string;
  user: UserModel;
  expirationTime: number;
}

export interface logoutAction {
  type: string;
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
