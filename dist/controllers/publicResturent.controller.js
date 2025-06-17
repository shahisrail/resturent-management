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
exports.getAllRestaurants = exports.getPublicMenu = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const foodItem_model_1 = __importDefault(require("../models/foodItem.model"));
const restaurant_model_1 = __importDefault(require("../models/restaurant.model"));
const subcategory_model_1 = __importDefault(require("../models/subcategory.model"));
const getPublicMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantId } = req.params;
        const restaurant = yield restaurant_model_1.default
            .findById(restaurantId)
            .select("name") // Only select the 'name' field for restaurant
            .lean();
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        // Fetch categories for the restaurant
        const categories = yield category_model_1.default
            .find({ restaurant: restaurant._id })
            .select("_id name") // Select only _id and name for categories
            .lean();
        // Using Promise.all to fetch subcategories and food items in parallel
        const menu = yield Promise.all(categories.map((category) => __awaiter(void 0, void 0, void 0, function* () {
            // Fetch subcategories for the current category
            const subcategories = yield subcategory_model_1.default
                .find({ category: category._id })
                .select("_id name") // Select only _id and name for subcategories
                .lean();
            // Fetch food items for each subcategory in parallel
            const subcategoriesWithFoodItems = yield Promise.all(subcategories.map((subcategory) => __awaiter(void 0, void 0, void 0, function* () {
                const foodItems = yield foodItem_model_1.default
                    .find({ subcategory: subcategory._id })
                    .select("_id name price imageUrl") // Select only _id, name, price, and imageUrl for food items
                    .lean();
                return Object.assign(Object.assign({}, subcategory), { foodItems });
            })));
            return Object.assign(Object.assign({}, category), { subcategories: subcategoriesWithFoodItems });
        })));
        // Send the response with restaurant name and menu
        res.json({ restaurant: restaurant.name, menu });
    }
    catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: "Server error" });
    }
});
exports.getPublicMenu = getPublicMenu;
const getAllRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all restaurants
        const restaurants = yield restaurant_model_1.default.find().select("name _id").lean(); // Select only name and _id fields
        if (restaurants.length === 0) {
            return res.status(404).json({ error: "No restaurants found" });
        }
        // Return the list of restaurants
        res.json({ restaurants });
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Server error" });
    }
});
exports.getAllRestaurants = getAllRestaurants;
