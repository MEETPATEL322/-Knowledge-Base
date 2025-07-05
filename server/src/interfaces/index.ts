import { Types } from "mongoose";
import { QuestionStatus, UserRole } from "../enums";
import { Request } from "express";

export interface IUser {
  _id: string | Types.ObjectId;
  name: string;
  email: string;
  password: string;
  accessToken: string;
  role: UserRole;
  Create_at: Date;
  Update_at: Date;
}

export interface IQuestion {
  questionText: string;
  createdBy?: Types.ObjectId;
  aiSuggestedAnswer?: string;
  finalAnswer?: string;
  status: QuestionStatus;
  createdAt: Date;
}

export interface CustomRequest extends Request {
  user?: {
    id: string | Types.ObjectId;
    role: string;
  };
}
