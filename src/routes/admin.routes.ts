import express from "express";

import {
  addRestaurant,
  getAllRestaurants,
  updateRestaurant,
  deleteRestaurant,
  getAllUsers,
  blockUnblockUser,
  getRestaurantById,
} from "../controllers/admin.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";

const router = express.Router();

router.post(
  "/restaurants",
  authenticate,
  authorizeRoles("admin"),
  addRestaurant
);
router.get(
  "/restaurants",
  authenticate,
  authorizeRoles("admin"),
  getAllRestaurants
);
router.get("/restaurants/:id", authenticate, authorizeRoles("admin"), getRestaurantById);
router.put(
  "/restaurants/:id",
  authenticate,
  authorizeRoles("admin"),
  updateRestaurant
);
router.delete(
  "/restaurants/:id",
  authenticate,
  authorizeRoles("admin"),
  deleteRestaurant
);

router.get("/users", authenticate, authorizeRoles("admin"), getAllUsers);
router.patch(
  "/users/:id/block",
  authenticate,
  authorizeRoles("admin"),
  blockUnblockUser
);

export default router;
