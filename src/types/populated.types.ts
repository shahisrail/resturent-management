 
import { Types } from "mongoose";
import { ICategory } from "../models/category.model";
import { IRestaurant } from "../models/restaurant.model";
import { ISubcategory } from "../models/subcategory.model";
import { IFoodItem } from "../models/foodItem.model";

// Interface for a Category document with its restaurant populated
export interface ICategoryPopulated extends Omit<ICategory, "restaurant"> {
  restaurant: IRestaurant; // When 'restaurant' is populated, it becomes an IRestaurant document
}

// Interface for a Subcategory document with its category populated
export interface ISubcategoryPopulated extends Omit<ISubcategory, "category"> {
  category: ICategoryPopulated; // When 'category' is populated, it becomes an ICategoryPopulated document
}

// Interface for a FoodItem document with its subcategory and category populated
export interface IFoodItemPopulated
  extends Omit<IFoodItem, "subcategory" | "category" | "restaurant"> {
  subcategory: ISubcategoryPopulated; // When 'subcategory' is populated, it becomes an ISubcategoryPopulated document
  category: ICategoryPopulated; // When 'category' is populated (directly or via subcategory), it becomes an ICategoryPopulated document
  restaurant: IRestaurant; // When 'restaurant' is populated, it becomes an IRestaurant document
}
