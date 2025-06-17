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
exports.getRestaurantById = exports.blockUnblockUser = exports.getAllUsers = exports.deleteRestaurant = exports.updateRestaurant = exports.getAllRestaurants = exports.addRestaurant = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const restaurant_model_1 = __importDefault(require("../models/restaurant.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
// --- Restaurant CRUD ---
// Add new restaurant
const addRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, address, ownerName, password } = req.body;
        const existingUser = yield User_model_1.default.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ error: "User/Restaurant already exists with this email" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = new User_model_1.default({
            name: ownerName,
            email,
            password: hashedPassword,
            role: "restaurant",
        });
        yield user.save();
        const restaurant = new restaurant_model_1.default({
            name,
            email,
            phone,
            address,
            ownerName,
            isApproved: false,
        });
        yield restaurant.save();
        res.status(201).json({
            message: "Restaurant and login credentials created",
            restaurant,
            email,
            rawPassword: password,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.addRestaurant = addRestaurant;
// Get all restaurants
const getAllRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurants = yield restaurant_model_1.default.find();
        res.json({ restaurants });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.getAllRestaurants = getAllRestaurants;
// Update restaurant info
const updateRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const restaurant = yield restaurant_model_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
        });
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        res.json({ message: "Restaurant updated successfully", restaurant });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.updateRestaurant = updateRestaurant;
// Delete restaurant
const deleteRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const restaurant = yield restaurant_model_1.default.findByIdAndDelete(id);
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        res.json({ message: "Restaurant deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.deleteRestaurant = deleteRestaurant;
// --- User Management ---
// Get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_model_1.default.find();
        res.json({ users });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.getAllUsers = getAllUsers;
// Block or unblock user
const blockUnblockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { block } = req.body; // boolean true/false
        const user = yield User_model_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.isBlocked = block;
        yield user.save();
        res.json({
            message: `User has been ${block ? "blocked" : "unblocked"}`,
            user,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.blockUnblockUser = blockUnblockUser;
// Get a single restaurant by ID
const getRestaurantById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const restaurant = yield restaurant_model_1.default.findById(id);
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        res.json({ restaurant });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.getRestaurantById = getRestaurantById;
