import express from "express";
import {
  getMyRestaurant,
  updateMyRestaurant,
  changePassword,
} from "../controllers/restaurant.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/me", authenticate, authorizeRoles("restaurant"), getMyRestaurant);
router.put(
  "/me",
  authenticate,
  authorizeRoles("restaurant"),
  updateMyRestaurant
);
router.post(
  "/change-password",
  authenticate,
  authorizeRoles("restaurant"),
  changePassword
);

export default router;
