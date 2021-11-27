import { AppBar, Toolbar as Tb, Typography } from '@mui/material';
import classes from './toolbar.module.css';
import { useHistory } from 'react-router-dom';

const Toolbar = (props: {
  logo?: string;
  title?: string;
  minHeight?: string;
  children?: React.ReactElement;
}) => {
  const history = useHistory();
  return (
    <AppBar sx={{ position: 'relative', minHeight: props.minHeight }}>
      <Tb className={classes.toolbar}>
        <Typography
          onClick={() => history.push('/')}
          sx={{
            ml: 2,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            cursor: 'pointer',
          }}
          variant='h6'
          component='div'
        >
          {props.logo && <img src={props.logo} alt='' width='40px' />}
          {props.title}
        </Typography>
        <div className={classes['right-part']}>{props.children}</div>
      </Tb>
    </AppBar>
  );
};

export default Toolbar;
