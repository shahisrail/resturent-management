"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const publicResturent_controller_1 = require("../controllers/publicResturent.controller");
const admin_controller_1 = require("../controllers/admin.controller");
const router = express_1.default.Router();
router.get("/menu/:restaurantId", publicResturent_controller_1.getPublicMenu);
router.get("/restaurants", admin_controller_1.getAllRestaurants);
exports.default = router;
