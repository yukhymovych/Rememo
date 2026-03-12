import { http } from '@/shared/api/http';
import type {
  StudyQuestionAnswer,
  CreateStudyQuestionBody,
  UpdateStudyQuestionBody,
  GenerateStudyQuestionsBody,
} from '../domain/studyQuestions.types';

export async function getStudyQuestionsForPage(
  pageId: string
): Promise<StudyQuestionAnswer[]> {
  return http.get<StudyQuestionAnswer[]>(
    `/notes/${encodeURIComponent(pageId)}/study-questions`
  );
}

export async function createManualStudyQuestion(
  pageId: string,
  body: CreateStudyQuestionBody
): Promise<StudyQuestionAnswer> {
  return http.post<StudyQuestionAnswer>(
    `/notes/${encodeURIComponent(pageId)}/study-questions`,
    body
  );
}

export async function updateStudyQuestion(
  id: string,
  body: UpdateStudyQuestionBody
): Promise<StudyQuestionAnswer> {
  return http.patch<StudyQuestionAnswer>(
    `/study-questions/${encodeURIComponent(id)}`,
    body
  );
}

export async function deleteStudyQuestion(id: string): Promise<void> {
  return http.delete<void>(`/study-questions/${encodeURIComponent(id)}`);
}

export async function generateStudyQuestions(
  pageId: string,
  body?: GenerateStudyQuestionsBody
): Promise<StudyQuestionAnswer[]> {
  return http.post<StudyQuestionAnswer[]>(
    `/notes/${encodeURIComponent(pageId)}/study-questions/generate`,
    body ?? {}
  );
}
