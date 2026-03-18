import express from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import {
  handlePaymentComplete,
  handleGetMyPayments,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/complete", verifyAccessToken, handlePaymentComplete);
router.get("/my", verifyAccessToken, handleGetMyPayments);

export default router;
