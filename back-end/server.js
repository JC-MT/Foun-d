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

io.use((socket, next) => {
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
  if (!username) {
    return next(new Error("invalid username"));
  }
  // create new session
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
	console.log('j')
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
  sessionStore.findAllSessions().forEach((session) => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected,
    });
  });

  socket.emit("users", users);

  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
  });

  socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", {
			userID: socket.id,
			username: socket.username,
		});
  });

  socket.on("new message", (msg) => {
    console.log(msg);
    io.emit("send message", { message: msg, user: socket.username });
  });

  socket.on("new user", (usr) => {
    socket.username = usr;
    console.log("User connected - Username: " + socket.username);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server listenning http://localhost:${PORT}`);
});
