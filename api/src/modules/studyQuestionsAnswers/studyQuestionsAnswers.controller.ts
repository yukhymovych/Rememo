import { Request, Response, NextFunction } from 'express';
import * as studyQuestionsService from './studyQuestionsAnswers.service.js';
import {
  pageIdParamSchema,
  studyQuestionIdParamSchema,
  createStudyQuestionSchema,
  updateStudyQuestionSchema,
  generateStudyQuestionsSchema,
} from './studyQuestionsAnswers.schemas.js';

export async function getPageStudyQuestions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const pageId = pageIdParamSchema.parse(req.params.pageId);
    const rows = await studyQuestionsService.getByPage(pageId, userId);
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

export async function createManualStudyQuestion(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const pageId = pageIdParamSchema.parse(req.params.pageId);
    const input = createStudyQuestionSchema.parse(req.body);
    const created = await studyQuestionsService.createManual(pageId, userId, input);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

export async function generateStudyQuestions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const pageId = pageIdParamSchema.parse(req.params.pageId);
    const input = generateStudyQuestionsSchema.parse(req.body ?? {});
    const created = await studyQuestionsService.generateForPage(pageId, userId, input);
    res.json(created);
  } catch (error) {
    next(error);
  }
}

export async function updateStudyQuestion(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const id = studyQuestionIdParamSchema.parse(req.params.id);
    const input = updateStudyQuestionSchema.parse(req.body);
    const updated = await studyQuestionsService.updateById(id, userId, input);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteStudyQuestion(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const id = studyQuestionIdParamSchema.parse(req.params.id);
    await studyQuestionsService.deleteById(id, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
