import { Button, IconButton, Drawer } from '@mui/material';
import Toolbar from '../Toolbar';
import BottomDrawerModel from './bottom-drawer.model';

const BottomDrawer = (props: BottomDrawerModel) => (
  <Drawer
    className='bottom-drawer'
    sx={{ minWidth: '300px', height: '100vh' }}
    anchor='bottom'
    open={!!props.open}
    onClose={props.onClose}
  >
    <>
      <Toolbar title={props.title}>
        <>
          {props.additionalIconButtons?.map((button, index) => (
            <IconButton key={index} onClick={button.onClick}>
              {button.icon}
            </IconButton>
          ))}
          <Button sx={{ color: 'var(--color-black)' }} onClick={props.onClose}>
            close
          </Button>
        </>
      </Toolbar>
      <div className='main-padding'>{props.children}</div>
    </>
  </Drawer>
);

export default BottomDrawer;
