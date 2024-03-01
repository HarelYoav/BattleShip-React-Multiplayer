import React from 'react';
import {Box, Typography} from '@mui/material';

const NoPlayers = () => {
  return (
    <Box mt={5}>
        <Typography variant='subtitle1'>
            You are the only one online
        </Typography>
        <Typography variant='subtitle1'>
           Share the link below with your friend to play against
        </Typography>
        <Typography variant='subtitle1'>
            Link: yoavharel.com/battle-ship
        </Typography>
    </Box>
  )
}

export default NoPlayers