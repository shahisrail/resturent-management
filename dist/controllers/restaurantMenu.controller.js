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
exports.deleteFoodItem = exports.updateFoodItem = exports.getSubcategoriesByCategory = exports.getMyCategories = exports.getFoodItemsByRestaurant = exports.getFoodItemById = exports.getFullMenu = exports.createFoodItem = exports.createSubcategory = exports.createCategory = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const subcategory_model_1 = __importDefault(require("../models/subcategory.model"));
const foodItem_model_1 = __importDefault(require("../models/foodItem.model"));
const restaurant_model_1 = __importDefault(require("../models/restaurant.model"));
// ✅ Create Category
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield restaurant_model_1.default.findOne({ email: req.user.email });
        if (!restaurant)
            return res.status(404).json({ error: "Restaurant not found" });
        const newCategory = yield category_model_1.default.create({
            restaurant: restaurant._id,
            name: req.body.name,
        });
        res
            .status(201)
            .json({ message: "Category created", category: newCategory });
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.createCategory = createCategory;
// ✅ Create Subcategory
const createSubcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId, name } = req.body;
        const subcategory = yield subcategory_model_1.default.create({
            category: categoryId,
            name,
        });
        res.status(201).json({ message: "Subcategory created", subcategory });
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.createSubcategory = createSubcategory;
// ✅ Create Food Item
const createFoodItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure required fields from the request body
        const { categoryId, subcategoryId, name, price, description, imageUrl } = req.body;
        // Step 1: Validate if the restaurant exists (based on the logged-in user's email)
        const restaurant = yield restaurant_model_1.default.findOne({ email: req.user.email });
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        // Step 2: Check if the category belongs to the restaurant
        const category = yield category_model_1.default.findOne({
            _id: categoryId,
            restaurant: restaurant._id, // Ensure the category belongs to the logged-in restaurant
        });
        if (!category) {
            return res
                .status(400)
                .json({ error: "Invalid category or does not belong to you" });
        }
        // Step 3: Check if the subcategory belongs to the category
        const subcategory = yield subcategory_model_1.default.findOne({
            _id: subcategoryId,
            category: categoryId, // Ensure the subcategory belongs to the category
        });
        if (!subcategory) {
            return res.status(400).json({
                error: "Subcategory does not belong to the selected category",
            });
        }
        // Step 4: Create the food item, linking it to the restaurant, category, and subcategory
        const food = yield foodItem_model_1.default.create({
            category: category._id, // Link category to food item
            subcategory: subcategory._id, // Link subcategory to food item
            restaurant: restaurant._id,
            name,
            price,
            description,
            imageUrl,
        });
        // Step 5: Send success response
        return res.status(201).json({ message: "Food item created", food });
    }
    catch (err) {
        let errorMessage = "Server error";
        if (err instanceof Error) {
            // Type guard
            errorMessage = err.message;
        }
        res.status(500).json({ error: errorMessage, details: err });
    }
});
exports.createFoodItem = createFoodItem;
// ✅ Get Full Menu for My Restaurant
const getFullMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield restaurant_model_1.default.findOne({ email: req.user.email });
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        // Fetch categories for the restaurant with only the necessary fields
        const categories = yield category_model_1.default
            .find({ restaurant: restaurant._id })
            .select("_id name") // Only select necessary fields (e.g., _id, name)
            .lean();
        // Using Promise.all to load subcategories and food items in parallel for each category
        const menuWithDetails = yield Promise.all(categories.map((category) => __awaiter(void 0, void 0, void 0, function* () {
            // Fetch subcategories with only necessary fields
            const subcategories = yield subcategory_model_1.default
                .find({ category: category._id })
                .select("_id name") // Only select necessary fields (e.g., _id, name)
                .lean();
            // Parallel fetching of food items for each subcategory
            const subcategoriesWithFoodItems = yield Promise.all(subcategories.map((subcategory) => __awaiter(void 0, void 0, void 0, function* () {
                const foodItems = yield foodItem_model_1.default
                    .find({ subcategory: subcategory._id })
                    .select("_id name price imageUrl") // Only select necessary fields
                    .lean();
                // Return subcategory with food items
                return {
                    _id: subcategory._id,
                    name: subcategory.name,
                    foodItems,
                };
            })));
            // Return category with subcategories and their food items
            return {
                _id: category._id,
                name: category.name,
                subcategories: subcategoriesWithFoodItems,
            };
        })));
        res.json({ menu: menuWithDetails });
    }
    catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: "Server error" });
    }
});
exports.getFullMenu = getFullMenu;
// ✅ Get Food Item by ID
const getFoodItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const { foodId } = req.params; // Get food item ID from the URL params
        // Step 1: Retrieve the restaurant based on the logged-in user's email
        const restaurant = yield restaurant_model_1.default.findOne({ email: req.user.email });
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        // Step 2: Fetch the food item by its ID and populate category and subcategory details
        const food = yield foodItem_model_1.default.findById(foodId).populate({
            path: "subcategory", // Populate the subcategory
            populate: { path: "category" }, // Populate the category inside subcategory
        });
        if (!food) {
            return res.status(404).json({ error: "Food item not found" });
        }
        // Step 3: Ensure that the food item belongs to the logged-in restaurant
        if (food.subcategory.category.restaurant.toString() !==
            restaurant._id.toString()) {
            return res.status(403).json({ error: "You do not own this food item" });
        }
        // Step 4: Clean up and return the food item details
        const cleanedFood = {
            _id: food._id,
            name: food.name,
            price: food.price,
            description: food.description,
            imageUrl: food.imageUrl,
            categoryId: (_b = (_a = food.subcategory) === null || _a === void 0 ? void 0 : _a.category) === null || _b === void 0 ? void 0 : _b._id, // Category ID
            categoryName: (_d = (_c = food.subcategory) === null || _c === void 0 ? void 0 : _c.category) === null || _d === void 0 ? void 0 : _d.name, // Category Name
            subcategoryId: (_e = food.subcategory) === null || _e === void 0 ? void 0 : _e._id, // Subcategory ID
            subcategoryName: (_f = food.subcategory) === null || _f === void 0 ? void 0 : _f.name, // Subcategory Name
        };
        // Return the food item details
        res.json({ food: cleanedFood });
    }
    catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: "Server error" });
    }
});
exports.getFoodItemById = getFoodItemById;
// ✅ Get All Food Items for the Restaurant
const getFoodItemsByRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Find the restaurant using the logged-in user's email
        const restaurant = yield restaurant_model_1.default.findOne({ email: req.user.email });
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        console.log("Restaurant ID:", restaurant._id);
        // Step 2: Find food items directly related to this restaurant
        const foodItems = yield foodItem_model_1.default
            .find({ restaurant: restaurant._id }) // Match food items by restaurant ID
            .populate({
            path: "subcategory", // Populate subcategory details
            populate: { path: "category" }, // Populate category details
        })
            .select("_id name price description imageUrl subcategory") // Select necessary fields
            .lean(); // Use lean() to return plain JavaScript objects (for performance)
        // Step 3: Clean the response to include category and subcategory names, and their IDs
        const cleanedFoodItems = foodItems.map((food) => {
            var _a, _b, _c, _d, _e, _f;
            return {
                _id: food._id,
                name: food.name,
                price: food.price,
                description: food.description,
                imageUrl: food.imageUrl,
                categoryId: (_b = (_a = food.subcategory) === null || _a === void 0 ? void 0 : _a.category) === null || _b === void 0 ? void 0 : _b._id, // Category ID
                categoryName: (_d = (_c = food.subcategory) === null || _c === void 0 ? void 0 : _c.category) === null || _d === void 0 ? void 0 : _d.name, // Category name
                subcategoryId: (_e = food.subcategory) === null || _e === void 0 ? void 0 : _e._id, // Subcategory ID
                subcategoryName: (_f = food.subcategory) === null || _f === void 0 ? void 0 : _f.name, // Subcategory name
            };
        });
        // Step 4: If no food items are found, return an error message
        if (!cleanedFoodItems.length) {
            return res
                .status(404)
                .json({ error: "No food items found for this restaurant" });
        }
        // Step 5: Send the cleaned food items back in the response
        res.json({ foodItems: cleanedFoodItems });
    }
    catch (err) {
        console.error(err); // Log any error for debugging
        res.status(500).json({ error: "Server error" });
    }
});
exports.getFoodItemsByRestaurant = getFoodItemsByRestaurant;
// Get my categories
// GET /api/restaurant-menu/categories
const getMyCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield restaurant_model_1.default.findOne({ email: req.user.email });
        if (!restaurant)
            return res.status(404).json({ error: "Restaurant not found" });
        const categories = yield category_model_1.default.find({ restaurant: restaurant._id });
        res.json({ categories });
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.getMyCategories = getMyCategories;
// GET /api/restaurant-menu/subcategories/:categoryId
const getSubcategoriesByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        const subcategories = yield subcategory_model_1.default.find({ category: categoryId });
        res.json({ subcategories });
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.getSubcategoriesByCategory = getSubcategoriesByCategory;
// Update Food
const updateFoodItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { foodId } = req.params;
        const restaurant = yield restaurant_model_1.default.findOne({ email: req.user.email });
        const food = yield foodItem_model_1.default.findById(foodId).populate({
            path: "subcategory",
            populate: { path: "category" },
        });
        if (!food)
            return res.status(404).json({ error: "Food not found" });
        if (food.subcategory.category.restaurant.toString() !==
            restaurant._id.toString()) {
            return res.status(403).json({ error: "You do not own this food item" });
        }
        const updated = yield foodItem_model_1.default.findByIdAndUpdate(foodId, req.body, {
            new: true,
        });
        res.json({ message: "Food updated", food: updated });
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.updateFoodItem = updateFoodItem;
// Delete Food
const deleteFoodItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { foodId } = req.params;
        const restaurant = yield restaurant_model_1.default.findOne({ email: req.user.email });
        const food = yield foodItem_model_1.default.findById(foodId).populate({
            path: "subcategory",
            populate: { path: "category" },
        });
        if (!food)
            return res.status(404).json({ error: "Food not found" });
        if (food.subcategory.category.restaurant.toString() !==
            restaurant._id.toString()) {
            return res.status(403).json({ error: "You do not own this food item" });
        }
        yield foodItem_model_1.default.findByIdAndDelete(foodId);
        res.json({ message: "Food deleted" });
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.deleteFoodItem = deleteFoodItem;
