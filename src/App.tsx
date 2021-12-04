import './App.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/Header';
import { setTheme } from './style/theme';
import { ThemeProvider } from '@mui/material';

import Homepage from './pages/Homepage';
import Authentication from './pages/Authentication';
import Employees from './pages/Employees';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from './store/state';
import { useCallback, useEffect } from 'react';
import { auth, getUserByEmail } from './database';
import * as userActions from './store/user/actions';
import { UserModel } from './database/models';
import BeeBlack from './images/bee-black.svg';

const App = () => {
  const dispatch = useDispatch();

  const storeLogout = useCallback(
    () => dispatch(userActions.logout()),
    [dispatch],
  );
  const storeLogin = useCallback(
    (user: UserModel, expirationTime: number) =>
      dispatch(userActions.login(user, expirationTime)),
    [dispatch],
  );

  const user = useSelector((state: AppState) => state.userReducer.user);

  const theme = useSelector((state: AppState) => state.preferenceReducer.theme);

  useEffect(() => {
    auth.onAuthStateChanged(async (userCredentials: any) => {
      if (
        !userCredentials ||
        userCredentials.stsTokenManager.expirationTime < new Date().getTime()
      ) {
        storeLogout();
      } else {
        const user = (await getUserByEmail(userCredentials.email)) as UserModel;
        storeLogin(user, userCredentials.stsTokenManager.expirationTime);
      }
    });
  }, []);

  useEffect(() => {
    const root = document.querySelector('html');
    if (theme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={setTheme(theme)}>
          <Header logo={BeeBlack} title='Bee FYP'></Header>
          <div className={'main-container'}>
            <Switch>
              {user ? (
                <>
                  <Route exact path='/' component={Homepage} />
                  {user.role === 'owner' && (
                    <Route exact path='/employees' component={Employees} />
                  )}
                </>
              ) : (
                <>
                  <Route exact path='/' component={Authentication} />
                  <Route exact path='/employees' component={Authentication} />
                </>
              )}
              <Redirect to='/' />
            </Switch>
          </div>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
