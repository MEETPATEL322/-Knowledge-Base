import { Request, Response } from "express";
import { CustomRequest, IQuestion } from "../interfaces";
import Joi from "joi";
import { QuestionServices } from "../services/QuestionServices";
import { QuestionStatus, UserRole } from "../enums";
import { generateGeminiAnswer } from "../config/ai-helper";

export class QuestionController {
  public static async addQuestion(req: CustomRequest, res: Response) {
    const schema = Joi.object({
      questionText: Joi.string().required(),
      aiSuggestedAnswer: Joi.string().optional(),
      finalAnswer: Joi.string().optional(),
      status: Joi.string()
        .valid(...Object.values(QuestionStatus))
        .optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    try {
      const userId = req.user?.id;
      if (!userId) {
        res
          .status(400)
          .json({ message: "Unauthorized: User ID not found in token" });
        return;
      }

      const questionPayload: Partial<IQuestion> = {
        ...value,
        createdBy: userId,
      };
      const AIAnswer = await generateGeminiAnswer(value.questionText);

      const question: IQuestion = await QuestionServices.createQuestion({
        ...questionPayload,
        aiSuggestedAnswer: AIAnswer,
      });

      res.status(201).json({
        message: "Question added successfully",
        data: question,
      });
      return;
    } catch (err: any) {
      res.status(400).json({ message: err });
      return;
    }
  }
  public static async getAllQuestions(
    req: CustomRequest,
    res: Response
  ): Promise<void> {
    try {
      const questions = await QuestionServices.getAllQuestions({
        ...req.query,
        isAdmin: req?.user?.role === UserRole.Admin,
        createdBy:
          req?.user?.role === UserRole.Viewer ? undefined : req?.user?.id,
      });

      res.status(200).json({
        message: "Questions fetched successfully",
        data: questions,
      });
      return;
    } catch (err) {
      res.status(400).json({ message: err });
      return;
    }
  }

  public static async getDashboard(
    req: CustomRequest,
    res: Response
  ): Promise<void> {
    try {
      const questions = await QuestionServices.getDashboard();

      res.status(200).json({
        message: "Dashboard Data Fetch Successfully",
        data: questions,
      });
      return;
    } catch (err) {
      res.status(400).json({ message: err });
      return;
    }
  }

  public static async approveQuestions(
    req: CustomRequest,
    res: Response
  ): Promise<void> {
    const schema = Joi.object({
      status: Joi.string()
        .valid(
          QuestionStatus.Approved,
          QuestionStatus.Rejected,
          QuestionStatus.Pending
        )
        .required(),
      finalAnswer: Joi.string().optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    try {
      const questionId = req.params.questionId;

      const questionExist = await QuestionServices.findById(questionId);
      if (!questionExist) {
        res.status(404).json({ message: "Question not found" });
        return;
      }

      const updatedQuestion = await QuestionServices.updateQuestion(
        questionId,
        {
          status: value.status,
          finalAnswer: value.finalAnswer,
        }
      );

      res.status(200).json({
        message: `Question ${value.status.toLowerCase()} successfully`,
        data: updatedQuestion,
      });
    } catch (err) {
      res.status(400).json({ message: err });
      return;
    }
  }
}
