import { io } from "socket.io-client";

const socket = io('http://localhost:4000', { 
	autoConnect: false,
});

  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

//THIS CONNECTS OUR SOCKET
// socket.on("connect", () => {
//     console.log('Socket is connected')
//     console.log("ID:", socket.id);
//     console.log(socket)
//   });

//   socket.on("connect_error", (err) => {
//     if (err.message === "invalid username") {
//       console.log('unable to connect')
//     }
//   });

// 	// THIS DISPLAYS MESSAGE TO RECEIVER
//   socket.on("private message", ({ content, from }) => {
//     for (let i = 0; i < this.users.length; i++) {
//       const user = this.users[i];
//       if (user.userID === from) {
//         user.messages.push({
//           content,
//           fromSelf: false,
//         });
//         if (user !== this.selectedUser) {
//           user.hasNewMessages = true;
//         }
//         break;
//       }
//     }
//   });


// 	// THIS GIVES US CURRENT USERS
//   socket.on("users", (users) => {
//     users.forEach((user) => {
//       user.self = user.userID === socket.id;
//       // setUser({
//         // user.connected = false;
//         // user.messages = [];
//         // user.hasNewMessages = false;
//       // })
//     });
//     // put the current user first, and then sort by username
//     socket.users = users.sort((a, b) => {
//       if (a.self) return -1;
//       if (b.self) return 1;
//       if (a.username < b.username) return -1;
//       return a.username > b.username ? 1 : 0;
//     });

// 		// THIS NOTIFIES US OF ANY NEW USERS CONNCETED
//     socket.on("user connected", (user) => {
//       // setUser({
//         // user.connected = false;
//         // user.messages = [];
//         // user.hasNewMessages = false;
//       // })
//       users.push(user);
//     });
//   });
  export default socket;