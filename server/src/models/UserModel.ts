import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../interfaces";
import { UserRole } from "../enums";

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Viewer,
    },
    accessToken: { type: String },
  },
  {
    timestamps: {
      createdAt: "create_at",
      updatedAt: "update_at",
    },
     versionKey: false,
  }
);

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
