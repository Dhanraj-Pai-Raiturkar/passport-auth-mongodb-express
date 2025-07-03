import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { createUser, getUserByEmail, getUserById } from "../repo/userRepo";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await getUserByEmail(username);
        if (!user)
          return done(null, false, {
            message: "Incorrect email or password",
          });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return done(null, false, { message: "Incorrect email or password" });

        return done(null, (user as any)._id);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email provided"));

        // Check if user already exists
        let user = await getUserByEmail(email);

        if (!user) {
          // Create a new user in the DB
          user = await createUser({
            googleId: profile.id,
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            email,
            password: "",
            authProvider: "google",
          });
        }

        // Store user ID in session
        return done(null, (user as any)._id);
      } catch (error) {
        return done(error as any);
      }
    }
  )
);

passport.serializeUser((userId: any, done) => {
  console.log("serialize", userId);
  return done(null, userId);
});
passport.deserializeUser(async (id: any, done) => {
  console.log("deserialize", id);
  const user = await getUserById(id as string);
  done(null, id);
});

export default passport;
