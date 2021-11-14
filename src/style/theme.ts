import { createTheme } from '@mui/material/styles';

export const setTheme = (mode: 'dark' | 'light') =>
  createTheme({
    palette: {
      primary: {
        main: '#f0b90b',
      },
      secondary: {
        main: mode === 'dark' ? '#303030' : '#e6e6e6',
      },
      warning: {
        main: '#ff3c00',
      },
    },
  });
