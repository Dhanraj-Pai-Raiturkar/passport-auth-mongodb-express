import express from "express";
import { isAuthenticated } from "../middleware/auth";

const profileRoutes = express.Router();

profileRoutes.get("/", isAuthenticated, (req, res) => {
  console.log("profile", req.user);
  res.json({ user: req.user });
});

export default profileRoutes;
