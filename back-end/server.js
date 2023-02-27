const app = require("./app.js");
require("dotenv").config();
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);

const PORT = process.env.PORT;

const io = new Server(httpServer, {
  cors: {
    origin: `http://localhost:3000`,
    // methods: ["GET", "POST"],
    // credentials: true,
  },
});

const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();

const { InMemoryMessageStore } = require("./messageStore");
const messageStore = new InMemoryMessageStore();

io.use((socket, next) => {
	console.log('socket.handshake.auth is ', socket.handshake.auth)
  const sessionID = socket.handshake.auth.sessionID;
	
  if (sessionID) {
    // find existing session
    const session = sessionStore.findSession(sessionID);

    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }

  const username = socket.handshake.auth.username;
	console.log('username about to log in: ', username)
  if (!username) {
    return next(new Error("invalid username"));
  }
  // create new session
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;

  next();
});

io.on("connection", (socket) => {
  // persist session
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // emit session details
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });

  // join the "userID" room
  socket.join(socket.userID);

  const users = [];
	const messagesPerUser = new Map();
  messageStore.findMessagesForUser(socket.userID).forEach((message) => {
    const { from, to } = message;
    const otherUser = socket.userID === from ? to : from;
    if (messagesPerUser.has(otherUser)) {
      messagesPerUser.get(otherUser).push(message);
    } else {
      messagesPerUser.set(otherUser, [message]);
    }
  });

  sessionStore.findAllSessions().forEach((session) => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected,
			messages: messagesPerUser.get(session.userID) || [],
    });
  });

  socket.emit("users", users);

  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
		connected: true,
		messages: [],
  });

  socket.on("private message", ({ content, to }) => {
    const message = {
      content,
      from: socket.userID,
      to,
    };
    socket.to(to).to(socket.userID).emit("private message", message);
    messageStore.saveMessage(message);
  });

  socket.on("disconnect", async () => {
		const matchingSocket = await io.in(socket.userID).allSockets();
		const isDisconnected = matchingSocket.size === 0;
		if(isDisconnected){
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false,
      });
		}
  });

  // socket.on("new message", (msg) => {
  //   console.log(msg);
  //   io.emit("send message", { message: msg, user: socket.username });
  // });

  // socket.on("new user", (usr) => {
  //   socket.username = usr;
  //   console.log("User connected - Username: " + socket.username);
  // });
});

httpServer.listen(PORT, () => {
  console.log(`Server listenning http://localhost:${PORT}`);
});
