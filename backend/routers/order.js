import express from "express";

import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";
import {
  allOrders,
  createProductReview,
  deleteOrder,
  deleteReview,
  getOrderDetails,
  getProductReviews,
  getSales,
  myOrders,
  newOrder,
  updateOrder,
} from "../controller/orderController.js";
import { canUserReview } from "../controller/productController.js";
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
router.get(
  "/admin/get-sales",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getSales,
);
router.get("/reviews", isAuthenticatedUser, getProductReviews);
router.post("/reviews", isAuthenticatedUser, createProductReview);
router.delete(
  "/admin/reviews",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteReview,
);
router.get("/can-review", isAuthenticatedUser, canUserReview);
export default router;
