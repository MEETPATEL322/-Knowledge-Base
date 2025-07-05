import { Request, Response } from "express";
import UserModel from "../models/UserModel"; 
import mongoose from "mongoose";
import { IUser } from "../interfaces";

export class UserServices {
  public static async findById(userId: string): Promise<IUser | null> {
    return await UserModel.findById(userId, { accessToken: 0 }).lean().exec();
  }
  public static async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email: email }, { accesssToken: 0 })
      .lean()
      .exec();
  }

  public static async createUser(userData: Partial<IUser>): Promise<IUser> {
    const newUser = new UserModel(userData);
    return await newUser.save();
  }

  public static async updateUser(
    userId: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    return await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: userData },
      { new: true }
    )
      .lean()
      .exec();
  }
}
