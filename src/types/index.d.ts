// src/types/express.d.ts (or src/types/index.d.ts)

import { Request } from "express";
import { Document, Types } from "mongoose"; // Assuming you use mongoose

// Define your User interface (or import it from your user model)
interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  role: "admin" | "restaurant" | "user"; // Or whatever roles you have
  // Add other user properties
}

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      // For authentication middleware
      user?: IUser; // 'user' property added by authentication middleware
      // For route parameters
      params: {
        restaurantId?: string;
        foodId?: string;
        categoryId?: string;
        // Add other dynamic route parameters as needed
        id?: string; // For general 'id' params
      };
      // For request body (if you use specific types for req.body)
      // body: YourRequestBodyType;
    }
  }
}
