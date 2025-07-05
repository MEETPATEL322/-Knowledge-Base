import express from "express";
import { UserController } from "../controllers/UserController";
import { authUser } from "../Middleware/authUser";

const router = express.Router();

router.post("/signup", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/tokenUserDetails", authUser, UserController.tokenUserDetails);

export default router;
