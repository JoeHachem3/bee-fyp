import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store/state';
import { logout } from '../../database';
import {
  Button,
  IconButton,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { LightMode, DarkMode, Settings, People } from '@mui/icons-material';
import Toolbar from '../Toolbar';
import * as preferenceActions from '../../store/preferences/actions';
import Sidebar from '../Sidebar';
import BeeGold from '../../images/bee-gold.svg';
import classes from './header.module.css';
import { useHistory } from 'react-router-dom';

const Header = (props: { title?: string; logo?: string }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state: AppState) => state.userReducer.user);

  const theme = useSelector((state: AppState) => state.preferenceReducer.theme);

  const setTheme = useCallback(
    (theme: 'dark' | 'light') => dispatch(preferenceActions.setTheme(theme)),
    [dispatch],
  );

  const [route, setRoute] = useState<string>();

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const handleSideMenuChanges = (newRoute: string): void => {
    if (typeof newRoute !== 'string') return;
    setRoute(newRoute);
    setIsDrawerOpen(false);
    history.push(`/${newRoute}`);
  };

  return (
    <Toolbar
      logo={props.logo}
      title={props.title}
      onLogoClick={() => handleSideMenuChanges('')}
      minHeight='4rem'
    >
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
          <IconButton onClick={() => setIsDrawerOpen(true)}>
            <Settings />
          </IconButton>
        )}
        <>
          <Sidebar
            anchor='right'
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onOpen={() => setIsDrawerOpen(true)}
          >
            <>
              <div className={classes['sidebar-content']}>
                <div className={classes['logo-container']}>
                  <img src={BeeGold} alt='' width='40px' />
                </div>
                {user && (
                  <>
                    <Chip label={`${user.firstName} ${user.lastName}`} />
                    <ToggleButtonGroup
                      sx={{ flexDirection: 'column', gap: '1rem' }}
                      value={route}
                      exclusive
                      onChange={(e, newRoute) =>
                        handleSideMenuChanges(newRoute)
                      }
                    >
                      <ToggleButton
                        value='employees'
                        aria-label='employees'
                        sx={{
                          justifyContent: 'flex-start',
                          width: '100%',
                          gap: '1rem',
                          textTransform: 'none',
                        }}
                        onClick={() => setIsDrawerOpen(true)}
                      >
                        <People /> Employees
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </>
                )}
              </div>
              {user && (
                <Button
                  variant='text'
                  color='warning'
                  onClick={() => {
                    logout();
                    setIsDrawerOpen(false);
                  }}
                >
                  Logout
                </Button>
              )}
            </>
          </Sidebar>
        </>
      </>
    </Toolbar>
  );
};

export default Header;
