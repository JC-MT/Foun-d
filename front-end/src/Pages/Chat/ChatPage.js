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
	console.log(selectedUser)

	const handleTextChange = (event) => {
    setSeletedName({ name: event.target.value });
  };

	const prepareUserAttributes = (user) => {
		user.connected = true;
		user.messages = [];
		user.hasNewMessages = false;

		if(user.username === currentUser.username){
			user.self = true;
		}
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
		setSelectedUser(selectedUser)
	}

	useEffect(() => {
		socket.on('users' , (users) => {
				users.forEach((user) => {
					prepareUserAttributes(user)
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

			// save the ID of the user
			socket.userID = userID;

			setIsConnected({sessionID})
		});

		socket.on('user connected' , (user) => {
			prepareUserAttributes(user)
			setActiveUsers([...activeUsers, user])
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
      for (let idx = 0; idx < activeUsers.length; idx++) {
        let currentUser = activeUsers[idx];
        if (user.userID === currentUser.userID) {
          currentUser.connected = false;
          break;
        }
      }
			setActiveUsers([...activeUsers])
    });

    socket.on('message', data => {
      // setLastMessage(data);
    });

		socket.on("private message", ({ content, from }) => {
			for (let idx = 0; idx < activeUsers.length; idx++) {
				let user = activeUsers[idx];
				if (user.userID === from) {
					user.messages.push({
						content,
						fromSelf: false,
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
			// socket.off('session')
    };

  }, [currentUser, activeUsers]);

	const handleSubmit = (e) => {
		e.preventDefault()
		setCurrentUser({username: selectedName.name})
		const sessionID = window.localStorage.getItem("sessionID");

		if (sessionID) {
			socket.auth = { sessionID };
			socket.connect();
		} else {
			socket.auth = { username: currentUser.username};
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