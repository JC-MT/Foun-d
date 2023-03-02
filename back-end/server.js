const app = require("./app.js");
require("dotenv").config();
const { createServer } = require("http");
const httpServer = createServer(app);
const Redis = require("ioredis");
const redisClient = new Redis();

const PORT = process.env.PORT;

const io = require("socket.io")(httpServer, {
  cors: {
    origin: `http://localhost:3000`,
    // methods: ["GET", "POST"],
    // credentials: true,
  },
	adapter: require('socket.io-redis')({
		pubClient: redisClient,
    subClient: redisClient.duplicate(),
	})
});

const { setupWorker } = require("@socket.io/sticky");
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const { RedisSessionStore } = require("./sessionStore");
const sessionStore = new RedisSessionStore(redisClient);

const { RedisMessageStore } = require("./messageStore");
const messageStore = new RedisMessageStore(redisClient);

io.use( async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
	console.log('start of session id', sessionID, 'end of session id')

	
  if (sessionID) {
    // find existing session
    const session = await sessionStore.findSession(sessionID);

		console.log('start of session', session, 'end of session')
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
			socket.connected = session.connected
      return next();
    }
  }

  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  // create new session
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;

  next();
});

io.on("connection", async (socket) => {
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
		username: socket.username
  });

  // join the "userID" room
  socket.join(socket.userID);

  let users = [];
	const [messages, sessions] = await Promise.all([
    messageStore.findMessagesForUser(socket.userID),
    sessionStore.findAllSessions(),
  ]);
  const messagesPerUser = new Map();
  messages.forEach((message) => {
    const { from, to } = message;
    const otherUser = socket.userID === from ? to : from;
    if (messagesPerUser.has(otherUser)) {
      messagesPerUser.get(otherUser).push(message);
    } else {
      messagesPerUser.set(otherUser, [message]);
    }
  });

  sessions.forEach((session) => {
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
});

// httpServer.listen(PORT, () => {
//   console.log(`Server listenning http://localhost:${PORT}`);
// });
setupWorker(io);