import mongoose, { Schema, Document } from "mongoose";

export interface IFoodItem extends Document {
  category: mongoose.Types.ObjectId;
  subcategory: mongoose.Types.ObjectId;
  restaurant: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

const FoodItemSchema = new Schema<IFoodItem>(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true, 
    },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    imageUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model<IFoodItem>("FoodItem", FoodItemSchema);
