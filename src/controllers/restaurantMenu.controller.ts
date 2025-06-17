import { Request, Response } from "express";
import categoryModel from "../models/category.model";
import subcategoryModel from "../models/subcategory.model";
import foodItemModel from "../models/foodItem.model";
import restaurantModel from "../models/restaurant.model";
import { AuthRequest } from "../middlewares/auth.middleware";

// ✅ Create Category
export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const restaurant = await restaurantModel.findOne({ email: req.user.email });
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });

    const newCategory = await categoryModel.create({
      restaurant: restaurant._id,
      name: req.body.name,
    });

    res
      .status(201)
      .json({ message: "Category created", category: newCategory });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Create Subcategory
export const createSubcategory = async (req: AuthRequest, res: Response) => {
  try {
    const { categoryId, name } = req.body;

    const subcategory = await subcategoryModel.create({
      category: categoryId,
      name,
    });

    res.status(201).json({ message: "Subcategory created", subcategory });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Create Food Item
export const createFoodItem = async (req: any, res: Response) => {
  try {
    // Destructure required fields from the request body
    const { categoryId, subcategoryId, name, price, description, imageUrl } =
      req.body;

    // Step 1: Validate if the restaurant exists (based on the logged-in user's email)
    const restaurant = await restaurantModel.findOne({ email: req.user.email });
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Step 2: Check if the category belongs to the restaurant
    const category = await categoryModel.findOne({
      _id: categoryId,
      restaurant: restaurant._id, // Ensure the category belongs to the logged-in restaurant
    });
    if (!category) {
      return res
        .status(400)
        .json({ error: "Invalid category or does not belong to you" });
    }

    // Step 3: Check if the subcategory belongs to the category
    const subcategory = await subcategoryModel.findOne({
      _id: subcategoryId,
      category: categoryId, // Ensure the subcategory belongs to the category
    });
    if (!subcategory) {
      return res.status(400).json({
        error: "Subcategory does not belong to the selected category",
      });
    }

    // Step 4: Create the food item, linking it to the restaurant, category, and subcategory
    const food = await foodItemModel.create({
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
  } catch (err) {
    let errorMessage = "Server error";
    if (err instanceof Error) { // Type guard
      errorMessage = err.message;
    }
    res.status(500).json({ error: errorMessage, details: err });
  }
};

// ✅ Get Full Menu for My Restaurant
export const getFullMenu = async (req: AuthRequest, res: Response) => {
  try {
    const restaurant = await restaurantModel.findOne({ email: req.user.email });
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Fetch categories for the restaurant with only the necessary fields
    const categories = await categoryModel
      .find({ restaurant: restaurant._id })
      .select("_id name") // Only select necessary fields (e.g., _id, name)
      .lean();

    // Using Promise.all to load subcategories and food items in parallel for each category
    const menuWithDetails = await Promise.all(
      categories.map(async (category) => {
        // Fetch subcategories with only necessary fields
        const subcategories = await subcategoryModel
          .find({ category: category._id })
          .select("_id name") // Only select necessary fields (e.g., _id, name)
          .lean();

        // Parallel fetching of food items for each subcategory
        const subcategoriesWithFoodItems = await Promise.all(
          subcategories.map(async (subcategory) => {
            const foodItems = await foodItemModel
              .find({ subcategory: subcategory._id })
              .select("_id name price imageUrl") // Only select necessary fields
              .lean();

            // Return subcategory with food items
            return {
              _id: subcategory._id,
              name: subcategory.name,
              foodItems,
            };
          })
        );

        // Return category with subcategories and their food items
        return {
          _id: category._id,
          name: category.name,
          subcategories: subcategoriesWithFoodItems,
        };
      })
    );

    res.json({ menu: menuWithDetails });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Server error" });
  }
};
// ✅ Get Food Item by ID
export const getFoodItemById = async (req: AuthRequest, res: Response) => {
  try {
    const { foodId } = req.params; // Get food item ID from the URL params

    // Step 1: Retrieve the restaurant based on the logged-in user's email
    const restaurant = await restaurantModel.findOne({ email: req.user.email });
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Step 2: Fetch the food item by its ID and populate category and subcategory details
    const food = await foodItemModel.findById(foodId).populate({
      path: "subcategory", // Populate the subcategory
      populate: { path: "category" }, // Populate the category inside subcategory
    });

    if (!food) {
      return res.status(404).json({ error: "Food item not found" });
    }

    // Step 3: Ensure that the food item belongs to the logged-in restaurant
    if (
      (food.subcategory as any).category.restaurant.toString() !==
      restaurant._id.toString()
    ) {
      return res.status(403).json({ error: "You do not own this food item" });
    }

    // Step 4: Clean up and return the food item details
    const cleanedFood = {
      _id: food._id,
      name: food.name,
      price: food.price,
      description: food.description,
      imageUrl: food.imageUrl,
      categoryId: food.subcategory?.category?._id, // Category ID
      categoryName: food.subcategory?.category?.name, // Category Name
      subcategoryId: food.subcategory?._id, // Subcategory ID
      subcategoryName: food.subcategory?.name, // Subcategory Name
    };

    // Return the food item details
    res.json({ food: cleanedFood });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get All Food Items for the Restaurant
export const getFoodItemsByRestaurant = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Step 1: Find the restaurant using the logged-in user's email
    const restaurant = await restaurantModel.findOne({ email: req.user.email });
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    console.log("Restaurant ID:", restaurant._id);

    // Step 2: Find food items directly related to this restaurant
    const foodItems = await foodItemModel
      .find({ restaurant: restaurant._id }) // Match food items by restaurant ID
      .populate({
        path: "subcategory", // Populate subcategory details
        populate: { path: "category" }, // Populate category details
      })
      .select("_id name price description imageUrl subcategory") // Select necessary fields
      .lean(); // Use lean() to return plain JavaScript objects (for performance)

    // Step 3: Clean the response to include category and subcategory names, and their IDs
    const cleanedFoodItems = foodItems.map((food: any) => {
      return {
        _id: food._id,
        name: food.name,
        price: food.price,
        description: food.description,
        imageUrl: food.imageUrl,
        categoryId: food.subcategory?.category?._id, // Category ID
        categoryName: food.subcategory?.category?.name, // Category name
        subcategoryId: food.subcategory?._id, // Subcategory ID
        subcategoryName: food.subcategory?.name, // Subcategory name
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
  } catch (err) {
    console.error(err); // Log any error for debugging
    res.status(500).json({ error: "Server error" });
  }
};

// Get my categories
// GET /api/restaurant-menu/categories
export const getMyCategories = async (req: AuthRequest, res: Response) => {
  try {
    const restaurant = await restaurantModel.findOne({ email: req.user.email });
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });

    const categories = await categoryModel.find({ restaurant: restaurant._id });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
// GET /api/restaurant-menu/subcategories/:categoryId
export const getSubcategoriesByCategory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { categoryId } = req.params;

    const subcategories = await subcategoryModel.find({ category: categoryId });

    res.json({ subcategories });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update Food
export const updateFoodItem = async (req: AuthRequest, res: Response) => {
  try {
    const { foodId } = req.params;
    const restaurant = await restaurantModel.findOne({ email: req.user.email });

    const food = await foodItemModel.findById(foodId).populate({
      path: "subcategory",
      populate: { path: "category" },
    });

    if (!food) return res.status(404).json({ error: "Food not found" });

    if (
      (food.subcategory as any).category.restaurant.toString() !==
      restaurant._id.toString()
    ) {
      return res.status(403).json({ error: "You do not own this food item" });
    }

    const updated = await foodItemModel.findByIdAndUpdate(foodId, req.body, {
      new: true,
    });
    res.json({ message: "Food updated", food: updated });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete Food
export const deleteFoodItem = async (req: AuthRequest, res: Response) => {
  try {
    const { foodId } = req.params;
    const restaurant = await restaurantModel.findOne({ email: req.user.email });

    const food = await foodItemModel.findById(foodId).populate({
      path: "subcategory",
      populate: { path: "category" },
    });

    if (!food) return res.status(404).json({ error: "Food not found" });

    if (
      (food.subcategory as any).category.restaurant.toString() !==
      restaurant._id.toString()
    ) {
      return res.status(403).json({ error: "You do not own this food item" });
    }

    await foodItemModel.findByIdAndDelete(foodId);
    res.json({ message: "Food deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
