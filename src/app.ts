require("dotenv").config();

import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import passport from "passport";
import session from "express-session";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import "./config/passport";
import connectDB from "./config/database";

const app = express();
// Connect to MongoDB
connectDB();

app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173", // or env var
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "OK",
  });
});

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

export default app;
