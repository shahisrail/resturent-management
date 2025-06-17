// src/types/express.d.ts
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      params: {
        restaurantId?: string;
        // Add other params if you have them, e.g., userId?: string;
      };
      // If you have custom properties added by middleware (e.g., user), define them here
      user?: any; // Replace 'any' with a proper User interface
    }
  }
}
