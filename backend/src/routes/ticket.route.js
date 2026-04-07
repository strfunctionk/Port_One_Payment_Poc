import express from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import {
  handleGetTicketProducts,
  handleGetMyCredits,
} from "../controllers/ticket.controller.js";

const router = express.Router();

router.get("/products", handleGetTicketProducts);
router.get("/my-credits", verifyAccessToken, handleGetMyCredits);

export default router;
