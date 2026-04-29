import express from "express";
import {
  deleteProduct,
  deleteProductImage,
  getAdminProducts,
  getProductDetails,
  getProducts,
  newProducts,
  updateProduct,
  uploadProductImages,
} from "../controller/productController.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";
const router = express.Router();

router.get(
  "/products",
  // isAuthenticatedUser,
  // authorizeRoles("admin"),
  getProducts,
);
router.post(
  "/admin/products",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  newProducts,
);
router.put(
  "/admin/products/:id/upload-images",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  uploadProductImages,
);
router.get(
  "/admin/products",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAdminProducts,
);
router.put(
  "/admin/products/:id/delete-image",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteProductImage,
);
router.get(
  "/products/:id",
  // isAuthenticatedUser,
  getProductDetails,
);
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
