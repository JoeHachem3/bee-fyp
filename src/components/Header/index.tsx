import { useCallback, useState } from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store/state';
import { logout } from '../../database';
import { IconButton, Chip, SwipeableDrawer } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import Toolbar from '../Toolbar';
import * as preferenceActions from '../../store/preferences/actions';

const Header = (props: { title?: string; logo?: string }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: AppState) => state.userReducer.user);

  const theme = useSelector((state: AppState) => state.preferenceReducer.theme);

  const setTheme = useCallback(
    (theme: 'dark' | 'light') => dispatch(preferenceActions.setTheme(theme)),
    [dispatch],
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  return (
    <Toolbar logo={props.logo} title={props.title} minHeight='4rem'>
      <>
        {theme === 'dark' ? (
          <IconButton onClick={() => setTheme('light')}>
            <LightMode />
          </IconButton>
        ) : (
          <IconButton onClick={() => setTheme('dark')}>
            <DarkMode />
          </IconButton>
        )}
        {user && (
          <>
            <Chip
              label={`${user.first_name} ${user.last_name}`}
              onClick={() => setIsDrawerOpen(true)}
            />
            <SwipeableDrawer
              anchor='right'
              className='side-drawer'
              open={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              onOpen={() => setIsDrawerOpen(true)}
            >
              <Button variant='text' color='warning' onClick={logout}>
                Logout
              </Button>
            </SwipeableDrawer>
          </>
        )}
      </>
    </Toolbar>
  );
};

export default Header;
