import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Restaurant from "../models/restaurant.model";
import User from "../models/User.model";

// --- Restaurant CRUD ---

// Add new restaurant
export const addRestaurant = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, ownerName, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User/Restaurant already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: ownerName,
      email,
      password: hashedPassword,
      role: "restaurant",
    });
    await user.save();

    const restaurant = new Restaurant({
      name,
      email,
      phone,
      address,
      ownerName,
      isApproved: false,
    });
    await restaurant.save();

    res.status(201).json({
      message: "Restaurant and login credentials created",
      restaurant,
      email,
      rawPassword: password,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
// Get all restaurants
export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find();
    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update restaurant info
export const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const restaurant = await Restaurant.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json({ message: "Restaurant updated successfully", restaurant });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete restaurant
export const deleteRestaurant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findByIdAndDelete(id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// --- User Management ---

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Block or unblock user
export const blockUnblockUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { block } = req.body; // boolean true/false

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isBlocked = block;
    await user.save();

    res.json({
      message: `User has been ${block ? "blocked" : "unblocked"}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
// Get a single restaurant by ID
export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json({ restaurant });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
