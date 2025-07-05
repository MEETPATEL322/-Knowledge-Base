import QuestionModel from "../models/QuestionModel";
import { IQuestion } from "../interfaces";
import { Types } from "mongoose";

export class QuestionServices {
  public static async findById(questionId: string): Promise<IQuestion | null> {
    return await QuestionModel.findById(questionId).lean().exec();
  }

  public static async createQuestion(
    data: Partial<IQuestion>
  ): Promise<IQuestion> {
    const newQuestion = new QuestionModel(data);
    return await newQuestion.save();
  }

  public static async updateQuestion(
    questionId: string,
    data: Partial<IQuestion>
  ): Promise<IQuestion | null> {
    return await QuestionModel.findOneAndUpdate(
      { _id: questionId },
      { $set: data },
      { new: true }
    )
      .lean()
      .exec();
  }

  public static async getAllQuestions(query: {
    isAdmin: boolean;
    createdBy?: string | Types.ObjectId;
    status?: string;
  }) {
    const qry: any = {};
    if (!query.isAdmin && query.createdBy) {
      qry.createdBy = query.createdBy;
    }
    if (query.status) {
      qry.status = query.status;
    }
    const [questions, counts] = await Promise.all([
      QuestionModel.find(qry)
        .populate("createdBy")
        .sort({ create_at: -1 })
        .lean()
        .exec(),
      QuestionModel.countDocuments(qry),
    ]);
    return { questions, counts };
  }

  public static async getDashboard() {
    const aggregation = [
      {
        $group: {
          _id: null,
          totalQuestions: {
            $sum: 1,
          },
          approvedCount: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "approved"],
                },
                1,
                0,
              ],
            },
          },
          rejectedCount: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "rejected"],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalQuestions: 1,
          approvedCount: 1,
          rejectedCount: 1,
          rejectionRate: {
            $cond: [
              {
                $eq: ["$totalQuestions", 0],
              },
              0,
              {
                $divide: ["$rejectedCount", "$totalQuestions"],
              },
            ],
          },
        },
      },
    ];
    const resData = await QuestionModel.aggregate(aggregation).exec();
    return resData[0];
  }
}
