import express, { Request, Response, NextFunction } from "express";
import UserRoutes from "../routes/UserRoute";
import QuestionRoute from "../routes/QuestionRoute";

const router = express.Router();

router.use("/auth", UserRoutes);
router.use("/questions", QuestionRoute);

export default router;
