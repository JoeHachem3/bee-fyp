import { AppBar, Toolbar as Tb, Typography } from '@mui/material';
import classes from './toolbar.module.css';
import { IconButton } from '@mui/material';

const Toolbar = (props: {
  logo?: string;
  title?: string;
  minHeight?: string;
  children?: React.ReactElement;
  additionalIcons?: { icon: React.ReactElement; onClick: () => any }[];
  onLogoClick?: () => any;
}) => {
  return (
    <AppBar sx={{ position: 'relative', minHeight: props.minHeight }}>
      <Tb className={classes.toolbar}>
        <Typography
          sx={{
            ml: 2,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
          variant='h6'
          component='div'
        >
          {props.additionalIcons &&
            props.additionalIcons.map((icon, index) => (
              <IconButton key={index} onClick={icon.onClick}>
                {icon.icon}
              </IconButton>
            ))}
          {props.logo && (
            <img
              style={{
                cursor: props.onLogoClick ? 'pointer' : 'default',
              }}
              onClick={props.onLogoClick}
              src={props.logo}
              alt=''
              width='40px'
            />
          )}
          {props.title}
        </Typography>
        <div className={classes['right-part']}>{props.children}</div>
      </Tb>
    </AppBar>
  );
};

export default Toolbar;
