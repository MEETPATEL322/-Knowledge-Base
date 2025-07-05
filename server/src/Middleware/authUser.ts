import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest, IUser } from "../interfaces";
import { config } from "../config/config";
import { UserServices } from "../services/UserServices";
import UserModel from "../models/UserModel";

export async function authUser(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ message:"Authorization token missing or malformed" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = config.jwt_secrete;

    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
    };

    const user: IUser | null = await UserModel.findById(decoded.id);

    if (!user) {
      res.status(401).json({ message:"User not found" });
      return;
    }

    if (!user.accessToken || user.accessToken !== token) {
      res.status(401).json({ message:"Invalid or expired token" });
      return;
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
     res.status(401).json({ message:"Invalid or expired token" });
     return
  }
}
