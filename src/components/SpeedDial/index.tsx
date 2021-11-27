import { Box, SpeedDial as SD, SpeedDialIcon } from '@mui/material';
import React from 'react';

const SpeedDial = (props: { children?: React.ReactElement[] }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <SD
        ariaLabel='SpeedDial'
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {props.children}
      </SD>
    </Box>
  );
};

export default SpeedDial;
