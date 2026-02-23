import { useState } from 'react';
import { Button } from '@/shared/ui';

export interface LearningRevealProps {
  title: string;
  content: string;
}

export function LearningReveal({ title, content }: LearningRevealProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="learning-reveal">
      <h2 className="learning-reveal__title">{title}</h2>
      {!revealed ? (
        <Button
          variant="secondary"
          onClick={() => setRevealed(true)}
          className="learning-reveal__show-btn"
        >
          Show Answer
        </Button>
      ) : (
        <div className="learning-reveal__content">{content || '(No content)'}</div>
      )}
    </div>
  );
}
