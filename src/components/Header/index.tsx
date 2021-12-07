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
import {
  LightMode,
  DarkMode,
  Menu,
  Dashboard,
  Home,
} from '@mui/icons-material';
import Toolbar from '../Toolbar';
import * as preferenceActions from '../../store/preferences/actions';
import Sidebar from '../Sidebar';
import BeeGold from '../../images/bee-gold.svg';
import classes from './header.module.css';
import { useHistory, useLocation } from 'react-router-dom';

const Header = (props: { title?: string; logo?: string }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state: AppState) => state.userReducer.user);

  const theme = useSelector((state: AppState) => state.preferenceReducer.theme);

  const setTheme = useCallback(
    (theme: 'dark' | 'light') => dispatch(preferenceActions.setTheme(theme)),
    [dispatch],
  );

  const [route, setRoute] = useState<string>(
    useLocation().pathname.split('/')[1],
  );

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
      additionalIcons={
        user
          ? [
              {
                icon: <Menu />,
                onClick: () => setIsDrawerOpen(true),
              },
            ]
          : []
      }
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

        <>
          <Sidebar
            anchor='left'
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
                        className={classes['toggle-button']}
                        value=''
                        aria-label='homepage'
                        onClick={() => setIsDrawerOpen(true)}
                      >
                        <Home /> Homepage
                      </ToggleButton>
                      {user?.role === 'owner' && (
                        <ToggleButton
                          className={classes['toggle-button']}
                          value='dashboard'
                          aria-label='dashboard'
                          onClick={() => setIsDrawerOpen(true)}
                        >
                          <Dashboard /> Dashboard
                        </ToggleButton>
                      )}
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
