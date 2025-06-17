import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  restaurant: mongoose.Types.ObjectId;
  name: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("Category", CategorySchema);
