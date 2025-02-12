import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized User" });
    return;
  }

  try {
    const decoded = verifyToken(token);
    res.locals.user = decoded;

    next();
  } catch (error) {
    console.log("Inside the catch");
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
