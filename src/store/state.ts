import { PreferenceState } from './preferences/state';
import { UserState } from './user/state';

export interface AppState {
  userReducer: UserState;
  preferenceReducer: PreferenceState;
}
