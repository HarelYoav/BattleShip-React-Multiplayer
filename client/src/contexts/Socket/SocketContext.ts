import { createContext } from 'react';
import { Socket } from 'socket.io-client';
import { ICell, IUser } from '../../types';

export interface ISocketContextState {
    socket: Socket | undefined;
    uid: string;
    users: IUser[];
    play_invitations: string[];
    play_against: IUser | null;
    board: ICell[][];
}

export const defaultSocketContextState: ISocketContextState = {
    socket: undefined,
    uid: '',
    users: [],
    play_invitations: [],
    play_against: null,
    board: new Array(10)
};

export type TSocketContextActions = 'update_socket' | 'update_uid' | 'update_users' | 'add_invited' 
                                        | 'remove_invited' | 'remove_user'| 'update_play_against' | 'update_board';

export type TSocketContextPayload = string | IUser[] | Socket| string[]| IUser| null | ICell[][];

export interface ISocketContextActions {
    type: TSocketContextActions;
    payload: TSocketContextPayload;
}

export const SocketReducer = (state: ISocketContextState, action: ISocketContextActions) => {
    console.log('Message recieved - Action: ' + action.type + ' - Payload: ', action.payload);

    switch (action.type) {
        case 'update_socket':
            return { ...state, socket: action.payload as Socket };
        case 'update_uid':
            return { ...state, uid: action.payload as string };
        case 'update_users':
            return { ...state, users: action.payload as IUser[] };
        case 'remove_user':
            return { ...state, users: state.users.filter((user) => user.socketId !== (action.payload as string)) };
        case 'update_board':
            return { ...state, board: action.payload as ICell[][] };
        case 'add_invited':
            return { ...state, play_invitations: [...state.play_invitations, action.payload as string] };
        case 'remove_invited':
            return { ...state, play_invitations: state.play_invitations.filter((sokcetid) => sokcetid !== (action.payload as string)) };
        case 'update_play_against':
            return { ...state, play_against: action.payload as IUser || action.payload as null };
        default:
            return state;
    }
};

export interface ISocketContextProps {
    SocketState: ISocketContextState;
    SocketDispatch: React.Dispatch<ISocketContextActions>;
}

const SocketContext = createContext<ISocketContextProps>({
    SocketState: defaultSocketContextState,
    SocketDispatch: () => {}
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;