import { Button } from '@/shared/ui';
import type { Grade } from '../domain/learning.types';

const GRADE_LABELS: Record<Grade, string> = {
  again: 'Again',
  hard: 'Hard',
  good: 'Good',
  easy: 'Easy',
};

export interface LearningGradeBarProps {
  onGrade: (grade: Grade) => void;
  disabled?: boolean;
}

export function LearningGradeBar({ onGrade, disabled }: LearningGradeBarProps) {
  const grades: Grade[] = ['again', 'hard', 'good', 'easy'];

  return (
    <div className="learning-grade-bar">
      {grades.map((grade) => (
        <Button
          key={grade}
          variant={grade === 'again' ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => onGrade(grade)}
          disabled={disabled}
          className="learning-grade-bar__btn"
        >
          {GRADE_LABELS[grade]}
        </Button>
      ))}
    </div>
  );
}
