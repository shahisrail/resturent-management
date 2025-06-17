"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurant_controller_1 = require("../controllers/restaurant.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get("/me", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("restaurant"), restaurant_controller_1.getMyRestaurant);
router.put("/me", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("restaurant"), restaurant_controller_1.updateMyRestaurant);
router.post("/change-password", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("restaurant"), restaurant_controller_1.changePassword);
exports.default = router;
