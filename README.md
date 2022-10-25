# BattleShip Multiplayer React

You can find a [Live](http://yoavharel.com/battle-ship "Battle-Ship Online") version

This project was created with "create react app" (Typesctipt template)

The Backend is using express and socket.IO

When first connect to the game, the player have to choose a name.
Afterwards the player can see a list of all the players that are currently online.
![Screenshot from 2022-10-25 09-40-13](https://user-images.githubusercontent.com/88085119/197713994-cfff6be3-bb87-4e9c-a1fd-976bad7c0734.png)

Each player can invite any online player to play.
![Screenshot from 2022-10-25 09-40-22](https://user-images.githubusercontent.com/88085119/197714250-3c67214d-cded-493d-a9b9-bf13adbe6bd6.png)

If a player confirm the invitation, the players will move to the next screen that will allow them to orginaize their Ships.
![Screenshot from 2022-10-25 10-39-24](https://user-images.githubusercontent.com/88085119/197714542-4de9a282-5c6b-433e-89a2-7f94d2049a52.png)

Once a plyer placed all his Ships he will be able to press "Start" to indicate that he is ready to play.
![Screenshot from 2022-10-25 10-40-09](https://user-images.githubusercontent.com/88085119/197714986-88ba80bb-a85f-429a-a1e2-5eeac81cf9a0.png)


When both player are ready to play, the will start.
The first player that was ready will go first.
![Screenshot from 2022-10-25 10-40-22](https://user-images.githubusercontent.com/88085119/197715043-c68e3ceb-fb18-4821-a999-73668347a09e.png)

Each player on his turn choose a cell on the opponent board to shoot on.
![Screenshot from 2022-10-25 10-41-14](https://user-images.githubusercontent.com/88085119/197715149-537a67dd-7239-43b0-9621-b777319c9bc2.png)

The game will end while one of the player will loose all his Ships.


#To test this game on your local machine.

Please clone the project.

#The client side can be start with "npm start"

#The server side can be start with "npm run dev"








