import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/userModel";
import generateToken from "../utils/generateTokens";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({ token: generateToken(user.id) });
  } catch (error) {
    return res.status(500).json({ message: "Error creating user" });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    return res.status(200).json({ token: generateToken(user.id) });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in user" });
  }
};

export const updateUsernames = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // @ts-ignore
  const { id } = req.user; // Extracted from auth middleware
  const updates = req.body; // Contains only provided usernames

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUsernames = { ...user.usernames, ...updates };

    // Update the user in the database
    user.usernames = updatedUsernames;
    await user.save();

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating usernames" });
  }
};

export const verify = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // @ts-ignore
  const { id } = req.user as { id: string }; // Extracted from auth middleware

  try {
    const user = await User.findById(id).select("name email usernames");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ message: "Error verifying user" });
  }
};
