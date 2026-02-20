/**
 * Formats ISO date string for display.
 * Pure function - no side effects, no React.
 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats ISO date as relative time: "5 min ago", "17m ago", "2h ago", "2d ago", "1 week ago", "Feb 21".
 * Pure function - no side effects, no React.
 */
export function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);
  const diffW = Math.floor(diffD / 7);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) {
    if (diffMin === 1) return '1 min ago';
    if (diffMin < 10) return `${diffMin} min ago`;
    return `${diffMin}m ago`;
  }
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD < 7) return `${diffD}d ago`;
  if (diffW < 4) return diffW === 1 ? '1 week ago' : `${diffW} weeks ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
