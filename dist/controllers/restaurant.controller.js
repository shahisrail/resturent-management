"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateMyRestaurant = exports.getMyRestaurant = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const restaurant_model_1 = __importDefault(require("../models/restaurant.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
// ✅ Get restaurant details
const getMyRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_model_1.default.findById(req.user.id);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        const restaurant = yield restaurant_model_1.default.findOne({ email: user.email });
        if (!restaurant)
            return res.status(404).json({ error: "Restaurant not found" });
        res.json({ restaurant });
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.getMyRestaurant = getMyRestaurant;
// ✅ Update restaurant info
const updateMyRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_model_1.default.findById(req.user.id);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        const updates = req.body;
        const restaurant = yield restaurant_model_1.default.findOneAndUpdate({ email: user.email }, updates, { new: true });
        if (!restaurant)
            return res.status(404).json({ error: "Restaurant not found" });
        res.json({ message: "Updated successfully", restaurant });
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.updateMyRestaurant = updateMyRestaurant;
// ✅ Change password
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = yield User_model_1.default.findById(req.user.id); // ✅ fixed from _id
        if (!user)
            return res.status(404).json({ error: "User not found" });
        const isMatch = yield bcrypt_1.default.compare(currentPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ error: "Incorrect current password" });
        user.password = yield bcrypt_1.default.hash(newPassword, 10);
        yield user.save();
        res.json({ message: "Password changed successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.changePassword = changePassword;
