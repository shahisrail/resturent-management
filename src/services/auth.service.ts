import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (data: any) => {
  const { name, email, password, role } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(password, 10);

  // Restaurant users cannot self-register, only admin can create
  if (role === "restaurant")
    throw new Error("Restaurant users must be created by admin");

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
    isApproved: true,
  });

  await user.save();

  return user;
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  if (user.role === "restaurant" && !user.isApproved) {
    throw new Error("Restaurant account not approved");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { user, token };
};
