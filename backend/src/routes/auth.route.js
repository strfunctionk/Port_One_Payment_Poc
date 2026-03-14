import express from "express";
import {
  handleSignUp,
  handleSignIn,
  handleSignOut,
  handleRefresh,
  handleProtect,
} from "../controllers/auth.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import { authLimiter, refreshLimiter } from "../configs/rate-limit.config.js";

const route = express.Router();

route.post("/signup", authLimiter, handleSignUp);
route.post("/signin", authLimiter, handleSignIn);
route.post("/signout", verifyAccessToken, handleSignOut);
route.post("/refresh", refreshLimiter, handleRefresh);
route.get("/protected", verifyAccessToken, handleProtect);

export default route;
