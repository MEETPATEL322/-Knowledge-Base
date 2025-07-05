import express from "express";
import { UserController } from "../controllers/UserController";
import { authUser } from "../Middleware/authUser";
import { authorizeRole } from "../Middleware/authorizeRole";
import { UserRole } from "../enums";
import { QuestionController } from "../controllers/QuestionController";

const router = express.Router();

router.post(
  "/",
  authUser,
  authorizeRole(UserRole.Contributor, UserRole.Admin),
  QuestionController.addQuestion
);

router.get(
  "/",
  authUser,
  authorizeRole(UserRole.Contributor, UserRole.Admin, UserRole.Viewer),
  QuestionController.getAllQuestions
);

router.get(
  "/dashboard",
  authUser,
  authorizeRole(UserRole.Admin),
  QuestionController.getDashboard
);

router.patch(
  "/approve/:questionId",
  authUser,
  authorizeRole(UserRole.Admin),
  QuestionController.approveQuestions
);

router.patch(
  "/approve/:questionId",
  authUser,
  authorizeRole(UserRole.Admin),
  QuestionController.approveQuestions
);

export default router;
