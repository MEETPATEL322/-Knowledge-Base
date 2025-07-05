import { Response, NextFunction } from "express";
import { CustomRequest } from "../interfaces";

export function authorizeRole(...allowedRoles: string[]) {
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message:"User not authenticated" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res
        .status(403)
        .json({ message:"Access denied: insufficient permissions" });
      return;
    }
    next();
  };
}
