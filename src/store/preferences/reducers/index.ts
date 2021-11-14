import { setThemeAction } from '../actions';
import * as types from '../actions/types';
import { PreferenceState } from '../state';

const initialState: PreferenceState = {
  theme: localStorage.getItem('theme') as 'dark' | 'light',
};

const setTheme = (
  state: PreferenceState,
  action: setThemeAction,
): PreferenceState => {
  localStorage.setItem('theme', action.theme);
  return {
    ...state,
    theme: action.theme,
  };
};

const preferenceReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case types.SET_THEME:
      return setTheme(state, action);
    default:
      return state;
  }
};

export default preferenceReducer;
