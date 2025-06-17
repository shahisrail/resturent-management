import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../validations/auth.validation";
import { registerUser, loginUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const user = await registerUser(data);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const { user, token } = await loginUser(data);

    res.json({ message: "Login successful", user, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
    console.log(err.message);
  }
};

export const logout = async (req: Request, res: Response) => {
  // JWT token based logout is stateless by default
  // Frontend should delete token from client storage (localStorage/cookies)
  // Optional: Implement token blacklist if needed

  res.json({ message: "Logout successful" });
};
