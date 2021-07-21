/* == External Modules == */
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
// security
import helmet from "helmet";
import rateLimit from "express-rate-limit";

/* == Internal Modules == */

/* == Instanced Modules == */
const app = express();
const server = createServer(app);
const io = new Server(server);

/* == Configuration == */
dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();

// rate limit setup
const LIMIT = rateLimit({
  max: 10000,
  windowMs: 24 * 60 * 60 * 1000, // 1 day
  message: "Too many requests",
});

/* == Middleware == */
app.use(helmet());
app.use(LIMIT);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));

/* == Routes == */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

// 404 error
app.get("/*", (req, res) => {
  res.status(404).send("404 not Found");
});

// method not allowed
app.use((req, res) => {
  res.status(405).json({ message: "Method not allowed." });
});

/* == Sockets == */

io.on("connection", async socket => {
  const allPlayers = await io.allSockets();

  socket.on("move", msg => {
    socket.broadcast.emit("move", msg);
  });

  socket.on("look", data => {
    socket.broadcast.emit("look", data);
  });

  socket.on("newPlayer", id => {
    socket.broadcast.emit("newPlayer", id, Array.from(allPlayers));
  });

  socket.on("disconnect", () => {
    console.log("player disconnected", socket.id);
  });
});

/* == Server Bind == */
server.listen(PORT, () => console.log(`Live on ${PORT}`));
