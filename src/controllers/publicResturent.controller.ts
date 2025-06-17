import categoryModel from "../models/category.model";
import foodItemModel from "../models/foodItem.model";
import restaurantModel from "../models/restaurant.model";
import subcategoryModel from "../models/subcategory.model";

export const getPublicMenu = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await restaurantModel
      .findById(restaurantId)
      .select("name") // Only select the 'name' field for restaurant
      .lean();
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Fetch categories for the restaurant
    const categories = await categoryModel
      .find({ restaurant: restaurant._id })
      .select("_id name") // Select only _id and name for categories
      .lean();

    // Using Promise.all to fetch subcategories and food items in parallel
    const menu = await Promise.all(
      categories.map(async (category) => {
        // Fetch subcategories for the current category
        const subcategories = await subcategoryModel
          .find({ category: category._id })
          .select("_id name") // Select only _id and name for subcategories
          .lean();

        // Fetch food items for each subcategory in parallel
        const subcategoriesWithFoodItems = await Promise.all(
          subcategories.map(async (subcategory) => {
            const foodItems = await foodItemModel
              .find({ subcategory: subcategory._id })
              .select("_id name price imageUrl") // Select only _id, name, price, and imageUrl for food items
              .lean();
            return {
              ...subcategory,
              foodItems,
            };
          })
        );

        return {
          ...category,
          subcategories: subcategoriesWithFoodItems,
        };
      })
    );

    // Send the response with restaurant name and menu
    res.json({ restaurant: restaurant.name, menu });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Server error" });
  }
};
export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    // Fetch all restaurants
    const restaurants = await restaurantModel.find().select("name _id").lean(); // Select only name and _id fields

    if (restaurants.length === 0) {
      return res.status(404).json({ error: "No restaurants found" });
    }

    // Return the list of restaurants
    res.json({ restaurants });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Server error" });
  }
};
