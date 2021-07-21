/* == External Modules == */
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
// security
import helmet from "helmet";
import rateLimit from "express-rate-limit";

/* == Internal Modules == */

/* == Instanced Modules == */
const app = express();
/* == Configuration == */
dotenv.config();
const PORT = process.env.PORT;

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

// 404 error
app.get("/*", (req, res) => {
  res.status(404).send("404 not Found");
});

// method not allowed
app.use((req, res) => {
  res.status(405).json({ message: "Method not allowed." });
});
/* == Server Bind == */
app.listen(PORT, () => console.log(`Live on ${PORT}`));
