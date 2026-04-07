import express from "express";
import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import paymentRoute from "./payment.route.js";
import ticketRoute from "./ticket.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/payments", paymentRoute);
router.use("/tickets", ticketRoute);

export default router;
