const app = require("./app.js");
require("dotenv").config();
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);

const PORT = process.env.PORT;

const io = new Server(httpServer, {
  cors: {
    origin: `http://localhost:4000`,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  const users = [];
  console.log("new connection");
  for (let [id, socket] of io.of("/").sockets) {
    if (users[0]) {
      for (let user of users) {
        if (user.username !== socket.username) {
          users.push({
            userID: id,
            username: socket.username,
          });
        }
      }
    } else {
      users.push({
        userID: id,
        username: socket.username,
      });
    }
  }

  socket.emit("users", users);

  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });

  socket.on("private message", ({ sendThis, to }) => {
    socket.to(to).emit("private message", {
      sendThis,
      from: socket.id,
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.username);
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
  console.log(`Socket.io & App port at ${PORT}`);
});
// app.listen(PORT, () => {
//   console.log(`Started on port ${PORT}`);
// });
