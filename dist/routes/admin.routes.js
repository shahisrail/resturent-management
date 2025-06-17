"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post("/restaurants", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin"), admin_controller_1.addRestaurant);
router.get("/restaurants", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin"), admin_controller_1.getAllRestaurants);
router.get("/restaurants/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin"), admin_controller_1.getRestaurantById);
router.put("/restaurants/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin"), admin_controller_1.updateRestaurant);
router.delete("/restaurants/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin"), admin_controller_1.deleteRestaurant);
router.get("/users", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin"), admin_controller_1.getAllUsers);
router.patch("/users/:id/block", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin"), admin_controller_1.blockUnblockUser);
exports.default = router;
