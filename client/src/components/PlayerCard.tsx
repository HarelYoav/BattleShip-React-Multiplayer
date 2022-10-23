import { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import SocketContext  from '../contexts/Socket/SocketContext';
import VideogameAssetSharpIcon from '@mui/icons-material/VideogameAssetSharp';
import { IUser } from '../types';
import { Socket } from 'socket.io-client';
import {useGameStore} from '../store/authStore';
import {
  Card,
  Box, 
  CardActions, 
  CardContent, 
  Button, 
  Typography, 
  Avatar 
} from '@mui/material';



interface IPorps {
  user: IUser;
  uid: string;
  socket: Socket | undefined;
}

const PlayerCard = ({ user, uid, socket }: IPorps) => {

  const { play_invitations } = useContext(SocketContext).SocketState;
  const { SocketDispatch } = useContext(SocketContext);
  const { setOpponent } = useGameStore();
  const [isInvited, setIsInvited] = useState(false);
  const [iInvited, setIInvited] = useState(false);
  const navigate = useNavigate();

  //current user invite other player to play
  const inviteToPlay = () => {
    socket?.emit('invite_play', user.socketId);
    setIsInvited(true);
  };
  //current user cancel invitation of other player
  const cancelInviation = () => {
    socket?.emit('cancel_invite_play', user.socketId);
    setIsInvited(false)
  };

  //current user confirm invitation
  const confirmInvitation = () => {
    socket?.emit('confirm_play', uid, user.socketId, (users: IUser[]) => {
      SocketDispatch({ type: 'update_users', payload: users});
      SocketDispatch({type: 'remove_invited', payload: user.socketId});
      user.inGame = true;
      setOpponent(user.id);
      navigate('/game');
    });
  }

  useEffect(() => {
  }, [isInvited]);

  useEffect(() => {
    setIInvited(play_invitations.includes(user.socketId));
  }, [play_invitations, user.socketId])

  
  if (iInvited && !user.inGame)  {
    return (
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={'1rem'} px={2} py={1} my={1} sx={{border: 1, borderColor: 'grey.500', borderRadius: 1, bgcolor: '#fff59d'}}>
        <Avatar className='m-auto'>U</Avatar>
          <Typography variant="body2">
            {user.name} Invited you to play
          </Typography>
          <Button 
            onClick={confirmInvitation}
            size="small"
          >
            Confirm
          </Button>
      </Box>
    )
  }

  return (
    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} px={2} py={1} my={1} sx={{ border: 1, borderColor: 'grey.500', borderRadius: 1 }} gap={'1rem'}>
      <Avatar className='m-auto'>U</Avatar>
        <Typography variant="body2">
          {user.name}
        </Typography>
      {!user.inGame ? (
        !isInvited ? 
          (!user.inGame &&
            <Button 
              onClick={inviteToPlay}
              size="small">
                Play
            </Button>
          ) : (
            <Button 
              onClick={cancelInviation}
              variant="outlined" 
              color="error"
              size="small"
            >
              Cancel
            </Button>
        )
      ) : (
        <Typography variant="body2">
          <span className='mr-1'>In game</span> 
          <VideogameAssetSharpIcon/>
        </Typography>
      )}
    </Box>
  );
}

export default PlayerCard