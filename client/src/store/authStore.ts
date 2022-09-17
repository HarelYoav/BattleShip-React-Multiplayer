// import { useContext } from 'react';
import create from 'zustand';
// import { persist } from 'zustand/middleware';
// import { IUser } from '../types';
// import SocketContext  from '../contexts/Socket/SocketContext';


// type UserStore = {
  // userProfile: IUser | null;
//   allUsers: IUser[] | [];
//   topic: string | null;
//   addUser: (user: IUser) => void;
//   removeUser: () => void;
//   getAllUsers: () => void;
//   setSearchTopic: (topic: string) => void;
// }


// const UseAuthStore = create<UserStore>()(persist( set => ({
//   userProfile: null,
//   allUsers: [],
//   topic: null,
//   addUser(user: IUser) {
//     set({ userProfile: user });
//   },
//   removeUser() {
//     set({ userProfile: null });
//   },
//   async getAllUsers() {
//     const { users } = useContext(SocketContext).SocketState;;
//     set({ allUsers: users });
//   },
//   async setSearchTopic(topic: string) {
//     set({topic: topic});
//   }

// })));
   


// export default UseAuthStore;