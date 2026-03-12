import type { ReactNode } from 'react';

export interface LearningAnimatedSwitchProps {
  key: string;
  children: ReactNode;
}

export function LearningAnimatedSwitch({ key: keyProp, children }: LearningAnimatedSwitchProps) {
  return (
    <div key={keyProp} className="learning-animated-switch">
      {children}
    </div>
  );
}
