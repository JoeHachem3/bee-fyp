import classes from './bee-marker.module.css';
import { Tooltip, IconButton } from '@mui/material';
import BeeGold from '../../../images/bee-gold.svg';

const BeeMarker = (props: {
  lat: number;
  lng: number;
  name?: string;
  onClick: () => any;
}) => {
  return (
    <Tooltip title={props.name} arrow>
      <IconButton className={classes['bee-marker']} onClick={props.onClick}>
        <img src={BeeGold} width='100%' alt='' />
      </IconButton>
    </Tooltip>
  );
};

export default BeeMarker;
