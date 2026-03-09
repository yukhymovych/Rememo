export type StudyQuestionSource = 'manual' | 'generated';

export interface StudyQuestionAnswer {
  id: string;
  page_id: string;
  question: string;
  answer: string;
  source: StudyQuestionSource;
  created_at: string;
  updated_at: string;
}

export interface CreateStudyQuestionBody {
  question: string;
  answer: string;
}

export interface UpdateStudyQuestionBody {
  question?: string;
  answer?: string;
}

export type GenerateStudyQuestionsMode = 'one' | 'up_to_five';

export interface GenerateStudyQuestionsBody {
  text?: string;
  mode?: GenerateStudyQuestionsMode;
}
