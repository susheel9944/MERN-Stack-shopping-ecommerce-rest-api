import express from "express";

import { isAuthenticatedUser } from "../middleware/auth.js";
import {
  stipeWebhook,
  stripeCheckoutSession,
} from "../controller/paymentController.js";

const router = express.Router();

router.post(
  "/payment/checkout-session",
  isAuthenticatedUser,
  stripeCheckoutSession,
);

router.post(
  "/payment/webhook",
  express.raw({ type: "application/json" }), // ✅ MUST

  stipeWebhook,
);

export default router;
