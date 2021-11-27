import { useEffect, useState } from 'react';
import SidebarModel from './sidebar.model';
import { SwipeableDrawer } from '@mui/material';

const Sidebar = (props: SidebarModel) => {
  const [propState, setPropState] = useState<SidebarModel>(
    new SidebarModel({}),
  );

  useEffect(() => {
    setTimeout(() => {
      setPropState(new SidebarModel(props));
    }, 0);
  }, [props.anchor, props.open, props.onClose, props.onOpen, props]);

  return (
    <SwipeableDrawer
      anchor={propState.anchor}
      className='side-drawer'
      open={propState.open}
      onClose={propState.onClose}
      onOpen={propState.onOpen}
    >
      {props.children}
    </SwipeableDrawer>
  );
};

export default Sidebar;
