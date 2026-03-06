import type { StudyQuestionAnswer } from '../../domain/studyQuestions.types';

export interface StudyQuestionsAnswersBlockProps {
  pageId: string;
}

export interface StudyQuestionsAccordionProps {
  pairs: StudyQuestionAnswer[];
}
