import { Router } from 'express';
import { requireAuth } from '../../middlewares/requireAuth.js';
import * as studyQuestionsController from './studyQuestionsAnswers.controller.js';

export const studyQuestionsAnswersRouter = Router();

studyQuestionsAnswersRouter.use(requireAuth);

studyQuestionsAnswersRouter.patch(
  '/:id',
  studyQuestionsController.updateStudyQuestion
);
studyQuestionsAnswersRouter.delete(
  '/:id',
  studyQuestionsController.deleteStudyQuestion
);
