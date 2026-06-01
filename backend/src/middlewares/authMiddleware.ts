import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";

export const protect: RequestHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized!", success: false });
    return;
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as { id: string }; // Attach user ID to request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
