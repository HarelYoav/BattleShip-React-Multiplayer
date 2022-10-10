import { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import SocketContext  from '../contexts/Socket/SocketContext';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import VideogameAssetSharpIcon from '@mui/icons-material/VideogameAssetSharp';
import { IUser } from '../types';
import { Socket } from 'socket.io-client';
import {useGameStore} from '../store/authStore';


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
      <Card sx={{ maxWidth: 350, bgcolor: '#fff59d' }} color="success" variant="outlined" className='flex m-auto mb-1'>
        <Avatar className='m-auto'>U</Avatar>
        <CardContent>
          <Typography variant="body2" color='white'>
            {user.socketId} Invited you to play
          </Typography>
        </CardContent>
        <CardActions>
          <Button 
            onClick={confirmInvitation}
            size="small"
          >
            Confirm
          </Button>
        </CardActions>
      </Card>
    )
  }

  return (
    <Card sx={{ maxWidth: 350 }} variant="outlined" className='flex m-auto mb-1'>
      <Avatar className='m-auto'>U</Avatar>
      <CardContent>
        <Typography variant="body2">
          {user.socketId}
        </Typography>
      </CardContent>
      <CardActions>
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
      </CardActions>
    </Card>
  );
}

export default PlayerCard