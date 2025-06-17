import express from "express";
import { getPublicMenu } from "../controllers/publicResturent.controller";
import { getAllRestaurants } from "../controllers/admin.controller";

const router = express.Router();

router.get("/menu/:restaurantId", getPublicMenu);
router.get("/restaurants", getAllRestaurants);

export default router;
