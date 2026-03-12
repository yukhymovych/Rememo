import { Outlet } from 'react-router-dom';

export function LearningLayout() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
      }}
    >
      <Outlet />
    </div>
  );
}
