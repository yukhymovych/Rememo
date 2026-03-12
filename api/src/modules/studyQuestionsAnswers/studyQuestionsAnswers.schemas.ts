import { z } from 'zod';

export const pageIdParamSchema = z.string().uuid('Invalid page ID format');
export const studyQuestionIdParamSchema = z
  .string()
  .uuid('Invalid study question ID format');

export const createStudyQuestionSchema = z.object({
  question: z.string().trim().min(1).max(2000),
  answer: z.string().trim().min(1).max(4000),
});

export const updateStudyQuestionSchema = z
  .object({
    question: z.string().trim().min(1).max(2000).optional(),
    answer: z.string().trim().min(1).max(4000).optional(),
  })
  .refine((value) => value.question !== undefined || value.answer !== undefined, {
    message: 'At least one of question or answer is required',
  });

export const generateStudyQuestionsSchema = z.object({
  text: z.string().trim().min(1).max(10000).optional(),
  mode: z.enum(['one', 'up_to_five']).optional(),
});

export type CreateStudyQuestionInput = z.infer<typeof createStudyQuestionSchema>;
export type UpdateStudyQuestionInput = z.infer<typeof updateStudyQuestionSchema>;
export type GenerateStudyQuestionsInput = z.infer<typeof generateStudyQuestionsSchema>;
