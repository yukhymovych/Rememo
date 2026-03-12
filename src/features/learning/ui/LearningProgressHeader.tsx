import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';
import type { LearningSessionItem } from '../domain/learning.types';

export interface LearningProgressHeaderProps {
  items: LearningSessionItem[];
  currentIndex: number;
}

export function LearningProgressHeader({
  items,
  currentIndex,
}: LearningProgressHeaderProps) {
  const navigate = useNavigate();
  const reviewableItems = items.filter((i) => i.state !== 'unavailable');
  const totalCount = reviewableItems.length;

  const handleStop = () => {
    navigate('/notes');
  };

  return (
    <header className="learning-progress-header">
      <div className="learning-progress-header__progress">
        {currentIndex + 1} / {totalCount}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleStop}
        className="learning-progress-header__stop"
      >
        Stop Learning
      </Button>
    </header>
  );
}
