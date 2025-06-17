import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import {
  createSubcategory,
  createCategory,
  createFoodItem,
  getFullMenu,
  getMyCategories,
  getSubcategoriesByCategory,
  updateFoodItem,
  deleteFoodItem,
  getFoodItemById,
  getFoodItemsByRestaurant,
} from "../controllers/restaurantMenu.controller";

const router = express.Router();

router.post(
  "/category",
  authenticate,
  authorizeRoles("restaurant"),
  createCategory
);
router.post(
  "/subcategory",
  authenticate,
  authorizeRoles("restaurant"),
  createSubcategory
);
router.get(
  "/foods",
  authenticate,
  authorizeRoles("restaurant"),
  getFoodItemsByRestaurant
);

router.post(
  "/food",
  authenticate,
  authorizeRoles("restaurant"),
  createFoodItem
);
router.get("/menu", authenticate, authorizeRoles("restaurant"), getFullMenu);

router.get(
  "/food/:foodId",
  authenticate,
  authorizeRoles("restaurant"),
  getFoodItemById
);
router.get(
  "/categories",
  authenticate,
  authorizeRoles("restaurant"),
  getMyCategories
);
router.get(
  "/subcategories/:categoryId",
  authenticate,
  authorizeRoles("restaurant"),
  getSubcategoriesByCategory
);

router.put(
  "/food/:foodId",
  authenticate,
  authorizeRoles("restaurant"),
  updateFoodItem
);
router.delete(
  "/food/:foodId",
  authenticate,
  authorizeRoles("restaurant"),
  deleteFoodItem
);

export default router;
