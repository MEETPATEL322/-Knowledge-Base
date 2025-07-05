import mongoose, { Document, Schema, Types } from "mongoose";
import { IQuestion } from "../interfaces";
import { QuestionStatus } from "../enums";

const questionSchema: Schema<IQuestion> = new Schema<IQuestion>(
  {
    questionText: { type: String, required: true },
    aiSuggestedAnswer: { type: String },
    finalAnswer: { type: String },
    status: {
      type: String,
      enum: Object.values(QuestionStatus),
      default: QuestionStatus.Pending,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: {
      createdAt: "create_at",
      updatedAt: "update_at",
    },
    versionKey: false,
  }
);

const QuestionModel = mongoose.model<IQuestion>("Question", questionSchema);
export default QuestionModel;
