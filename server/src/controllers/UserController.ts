import { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import { UserServices } from "../services/UserServices";
import { CustomRequest, IUser } from "../interfaces";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { UserRole } from "../enums";

export class UserController {
  public static async registerUser(req: Request, res: Response) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      name: Joi.string().required(),
      role: Joi.string()
        .valid(UserRole.Contributor, UserRole.Viewer)
        .required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    try {
      const { email, password, name } = value;
      const existingUser: IUser | null = await UserServices.findByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: "User Email already registered" });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user: IUser = await UserServices.createUser({
        ...value,
        password: hashedPassword,
      });
      res
        .status(201)
        .json({ message: "User Created Successfully", data: user });
      return;
    } catch (err) {
      res.status(400).json({ message: error });
    }
  }

  public static async loginUser(req: Request, res: Response) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    try {
      const { email, password } = value;

      const user: IUser | null = await UserServices.findByEmail(email);
      if (!user) {
        res.status(404).json({
          message: "User not found. Please register first.",
        });
        return;
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(400).json({ message: "Invalid email or password." });
        return;
      }

      const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
      };

      const jwtSecret = config.jwt_secrete;
      if (!jwtSecret) {
        res.status(400).json({ message: "JWT secret is not defined" });
        return;
      }

      if (user.accessToken) {
        try {
          jwt.verify(user.accessToken, jwtSecret);
          res.status(200).json({
            message: "Login successful",
            accessToken: user.accessToken,
            user,
          });
          return;
        } catch (verifyError) {
          console.log("Jwt Exp");
        }
      }

      const token = jwt.sign(payload, jwtSecret, {
        expiresIn: config.jwt_exp_time,
      } as jwt.SignOptions);

      await UserServices.updateUser(user._id.toString(), {
        accessToken: token,
      });

      res.status(200).json({
        message: "Login successful",
        accessToken: token,
        user,
      });
      return;
    } catch (err: any) {
      res.status(400).json({ message: error });
      return;
    }
  }

  public static async tokenUserDetails(req: CustomRequest, res: Response) {
    try {
      const userId = req.user?.id as string;
      const user: IUser | null = await UserServices.findById(userId);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({
        message: "User retrieved successfully",
        data: user,
      });
      return;
    } catch (err: any) {
      res.status(400).json({ message: err });
      return;
    }
  }
}
