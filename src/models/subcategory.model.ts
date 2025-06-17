import mongoose, { Schema, Document } from "mongoose";

export interface ISubcategory extends Document {
  category: mongoose.Types.ObjectId;
  name: string;
}

const SubcategorySchema = new Schema<ISubcategory>(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISubcategory>("Subcategory", SubcategorySchema);
