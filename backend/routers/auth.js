import express from "express";
import {
  deleteUser,
  forgotPassword,
  getAllUser,
  getUserDetais,
  getUserProfile,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  updatePassword,
  updateProfile,
  updateUser,
} from "../controller/authController.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/me", isAuthenticatedUser, getUserProfile);
router.put("/me/update", isAuthenticatedUser, updateProfile);

router.put("/password/update", isAuthenticatedUser, updatePassword);

router.get(
  "/admin/users",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllUser,
);

router.get(
  "/admin/users/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getUserDetais,
);
router.put(
  "/admin/update/users/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateUser,
);
router.delete(
  "/admin/delete/users/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteUser,
);
export default router;
