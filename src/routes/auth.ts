import express from "express";
import passport from "passport";
import { createUser, getUserByEmail } from "../repo/userRepo";
import bcrypt from "bcrypt";

const authRoutes = express.Router();

authRoutes.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:5173/profile");
  }
);

authRoutes.get("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("connect.sid"); // if needed
    res.status(200).json({ message: "Logged out" });
  });
});

authRoutes.post("/login", (req, res, next) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({
        message: "Login successful",
        user: { username: user.username },
      });
    });
  })(req, res, next);
});

authRoutes.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const existing = await getUserByEmail(email);
  if (existing) return res.status(400).json({ message: "User already exists" });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await createUser({
    googleId: "null",
    firstName,
    lastName,
    email,
    password: hashedPassword,
    authProvider: "local",
  });
  await user.save();
  res.status(201).json({ message: "User registered successfully" });
});

export default authRoutes;
