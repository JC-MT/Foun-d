import Users from "./Users"
import Conversation from "./Conversation"
import { useState, useEffect } from "react"
import socket from "../../Components/Chatbox/Socket.IO/socket"

export default function ChatPage(){
	const [selectedName, setSeletedName] = useState({name: ''})
	const [currentUser, setCurrentUser] = useState({username: ''})
	const [activeUsers, setActiveUsers] = useState([])
	const [isConnected, setIsConnected] = useState({});
  const [selectedUser, setSelectedUser] = useState({});
	console.log(activeUsers)

	const handleTextChange = (event) => {
    setSeletedName({ name: event.target.value });
  };

	const prepareUserAttributes = (user, yourUserID) => {
		user.connected = true;
		user.hasNewMessages = false;

		if(user.userID === yourUserID){
			user.self = true;
		}

		user.messages.forEach((message) => {
			message.fromSelf = message.from === socket.userID;
		});
	}

	function handleMessage(content) {
		if (selectedUser.userID) {
			socket.emit("private message", {
				content,
				to: selectedUser.userID,
			});
			selectedUser.messages.push({
				content,
				fromSelf: true,
			});
		}
	}

	useEffect(() => {
		const session = window.localStorage.getItem("sessionID");

		if (session) {
			const sessionID = JSON.parse(session)
			socket.auth = { sessionID };
			socket.connect();
		}
		
		socket.on('users' , (users) => {
			const id = window.localStorage.getItem("userID");
			const yourUserID = JSON.parse(id)
			users.forEach((user) => {
				prepareUserAttributes(user, yourUserID)
			});

			let sortedUsers = users.sort((a, b) => {
				if (a.self) return -1;
				if (b.self) return 1;
				if (a.username < b.username) return -1;
				return a.username > b.username ? 1 : 0;
			});
			setActiveUsers([...sortedUsers])
		})

		socket.on("session", ({ sessionID, userID }) => {
			// attach the session ID to the next reconnection attempts
			socket.auth = { sessionID };
			// store it in the localStorage
			window.localStorage.setItem("sessionID", JSON.stringify(sessionID));
			window.localStorage.setItem("userID", JSON.stringify(userID));
			// save the ID of the user
			socket.userID = userID;

			setIsConnected({sessionID})
		});

		socket.on('user connected' , (user) => {
			const userExist = activeUsers.find((activeUser) => activeUser.userID === user.userID)
			const id = window.localStorage.getItem("userID");
			const yourUserID = JSON.parse(id)

			if(userExist){
				for (let user of activeUsers) {
					if (userExist.userID === user.userID) {
						user.connected = true;
						break;
					}
				}
				setActiveUsers([...activeUsers])
			} else {
				prepareUserAttributes(user, yourUserID)
				setActiveUsers([...activeUsers, user])
			}
		})

		socket.on("connect", () => {
			activeUsers.forEach((user) => {
				if (user.self) {
					user.connected = true;
				}
			});
			setActiveUsers([...activeUsers])
		});
		
		socket.on("disconnect", () => {
			activeUsers.forEach((user) => {
				if (user.self) {
					user.connected = false;
				}
			});
			setActiveUsers([...activeUsers])
		});

    socket.on('user disconnected', (user) => {
			const disconnetedID = user[0]
      for (let user of activeUsers) {
        if (disconnetedID === user.userID) {
          user.connected = false;
          break;
        }
      }
			setActiveUsers([...activeUsers])
    });

    socket.on('message', data => {
      // setLastMessage(data);
    });

		socket.on("private message", ({ content, from, to }) => {
			for (let idx = 0; idx < activeUsers.length; idx++) {
				let user = activeUsers[idx];
        const fromSelf = socket.userID === from;
        if (user.userID === (fromSelf ? to : from)) {
          user.messages.push({
            content,
            fromSelf,
          });
					if (user.userID !== selectedUser.userID) {
						user.hasNewMessages = true;
					}
					break;
				}
			}
			setActiveUsers([...activeUsers])
		});

		socket.on("connect_error", (err) => {
			console.log(`connect_error due to ${err.message}`);
		});

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
			socket.off('connect_error');
			socket.off('users');
			socket.off('private message');
			socket.off('user connected');
			socket.off('user disconnected')
			socket.off('session')
    };

  }, [currentUser, activeUsers]);

	const handleSubmit = (e) => {
		e.preventDefault()
		setCurrentUser({username: selectedName.name})
		const sessionID = window.localStorage.getItem("sessionID");

		console.log(sessionID)
		if (sessionID) {
			socket.auth = { sessionID };
			socket.connect();
		} else {
			socket.auth = { username: selectedName.name};
			socket.connect();
		}
		setSeletedName({name: ''})
	}

  return (
		<div className="pt-24">
			<form onSubmit={handleSubmit}>
			<input  value={selectedName.name} onChange={handleTextChange} className='w-[50%] border-2' type="text"/>
			<button type="submit" >Submit</button>
			</form>
		<div className="pt-2 flex">
			<div className="w-[30%]">
				<Users setSelectedUser={setSelectedUser} activeUsers={activeUsers}/>
			</div>
			<div className="w-[70%]">
				<Conversation handleMessage={handleMessage} selectedUser={selectedUser}/>
			</div>
		</div>


		</div>
	)
};