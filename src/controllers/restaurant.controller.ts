import bcrypt from "bcrypt";
import { AuthRequest } from "../middlewares/auth.middleware";
import restaurantModel from "../models/restaurant.model";
import UserModel from "../models/User.model";
import { Response } from "express";

// ✅ Get restaurant details
export const getMyRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const restaurant = await restaurantModel.findOne({ email: user.email });
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });

    res.json({ restaurant });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update restaurant info
export const updateMyRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const updates = req.body;

    const restaurant = await restaurantModel.findOneAndUpdate(
      { email: user.email },
      updates,
      { new: true }
    );

    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });

    res.json({ message: "Updated successfully", restaurant });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Change password
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await UserModel.findById(req.user.id); // ✅ fixed from _id

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Incorrect current password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
