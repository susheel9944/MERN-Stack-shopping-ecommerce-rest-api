import express from "express";
import {
  deleteProduct,
  getProductDetails,
  getProducts,
  newProducts,
  updateProduct,
} from "../controller/productController.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";
const router = express.Router();

router.get(
  "/products",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getProducts,
);
router.post(
  "/admin/products",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  newProducts,
);

router.get("/products/:id", isAuthenticatedUser, getProductDetails);
router.put(
  "/admin/products/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateProduct,
);
router.delete(
  "/admin/products/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteProduct,
);

export default router;
