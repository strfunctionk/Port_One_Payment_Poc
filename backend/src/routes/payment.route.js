import express from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import {
  handlePaymentComplete,
  handleGetMyPayments,
  handleGetChannelKey,
  handlePaymentCancel,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/channel-key", handleGetChannelKey);
router.post("/complete", verifyAccessToken, handlePaymentComplete);
router.get("/my", verifyAccessToken, handleGetMyPayments);
router.post("/:paymentId/cancel", verifyAccessToken, handlePaymentCancel);

export default router;
