import express from "express";

import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";
import {
  allOrders,
  createProductReview,
  deleteOrder,
  deleteReview,
  getOrderDetails,
  getProductReviews,
  myOrders,
  newOrder,
  updateOrder,
} from "../controller/orderController.js";
const router = express.Router();

router.post("/orders/new", isAuthenticatedUser, newOrder);
router.get("/order/:id", isAuthenticatedUser, getOrderDetails);
router.get("/me/orders", isAuthenticatedUser, myOrders);
router.get(
  "/admin/orders",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  allOrders,
);
router.put(
  "/admin/orders/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateOrder,
);
router.delete(
  "/admin/delete/orders/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteOrder,
);
router.get("/reviews", isAuthenticatedUser, getProductReviews);
router.post("/reviews", isAuthenticatedUser, createProductReview);
router.delete(
  "/admin/reviews",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteReview,
);
export default router;
