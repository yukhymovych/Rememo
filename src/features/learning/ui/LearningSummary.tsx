import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';
import type { LearningSessionItem } from '../domain/learning.types';

export interface LearningSummaryProps {
  items: LearningSessionItem[];
}

export function LearningSummary({ items }: LearningSummaryProps) {
  const navigate = useNavigate();
  const doneCount = items.filter((i) => i.state === 'done').length;
  const totalCount = items.length;

  const handleDone = () => {
    navigate('/notes');
  };

  return (
    <div className="learning-summary">
      <h2 className="learning-summary__title">Session Complete</h2>
      <p className="learning-summary__stats">
        You reviewed {doneCount} of {totalCount} items.
      </p>
      <Button variant="primary" onClick={handleDone} className="learning-summary__btn">
        Done
      </Button>
    </div>
  );
}
