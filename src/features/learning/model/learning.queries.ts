export const LEARNING_KEYS = {
  all: ['learning'] as const,
  todaySession: (timezone?: string) =>
    [...LEARNING_KEYS.all, 'today', timezone ?? 'browser'] as const,
  studyItemStatus: (pageId: string) =>
    [...LEARNING_KEYS.all, 'studyItem', pageId] as const,
};

export function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';
  } catch {
    return 'UTC';
  }
}
