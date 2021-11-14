import * as types from './types';

export interface setThemeAction {
  type: string;
  theme: 'dark' | 'light';
}

export const setTheme = (theme: 'dark' | 'light'): setThemeAction => {
  return {
    type: types.SET_THEME,
    theme,
  };
};
