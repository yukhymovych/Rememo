/**
 * Reminder cron logging: human-readable console lines by default.
 * Set REMINDER_JOB_LOG_FORMAT=json for one-line JSON (log aggregators).
 *
 * ANSI colors: on by default for human mode; respect NO_COLOR or REMINDER_JOB_LOG_COLORS=false.
 */

type ReminderJobLogLevel = 'info' | 'warn' | 'error';

const ansi = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  green: '\x1b[32m',
  gray: '\x1b[90m',
} as const;

function useJsonReminderLogs(): boolean {
  return process.env.REMINDER_JOB_LOG_FORMAT?.toLowerCase().trim() === 'json';
}

function useAnsiStyling(): boolean {
  if (useJsonReminderLogs()) return false;
  if (process.env.NO_COLOR) return false;
  if (process.env.REMINDER_JOB_LOG_COLORS?.toLowerCase().trim() === 'false') return false;
  return true;
}

function serializeValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value instanceof Date) return value.toISOString();
  return JSON.stringify(value);
}

function formatLogHead(level: ReminderJobLogLevel, event: string): string {
  if (!useAnsiStyling()) {
    return `[reminders][job] ${level.toUpperCase()}  ${event}`;
  }
  const badge =
    level === 'error'
      ? `${ansi.red}${ansi.bold}ERR${ansi.reset}`
      : level === 'warn'
        ? `${ansi.yellow}${ansi.bold}WRN${ansi.reset}`
        : `${ansi.cyan}${ansi.bold}INF${ansi.reset}`;
  return `${ansi.gray}[reminders][job]${ansi.reset} ${badge} ${ansi.bold}${event}${ansi.reset}`;
}

function styleKeyValueLine(
  key: string,
  value: string,
  level: ReminderJobLogLevel,
  event: string
): string {
  if (!useAnsiStyling()) {
    return `  ${key}: ${value}`;
  }

  if (key === 'skipReason') {
    return `  ${ansi.gray}${key}:${ansi.reset} ${ansi.magenta}${ansi.bold}${value}${ansi.reset}`;
  }
  if (key === 'detail') {
    return `  ${ansi.gray}${key}:${ansi.reset} ${ansi.dim}${value}${ansi.reset}`;
  }
  if (key === 'userId' || key === 'runId') {
    return `  ${ansi.gray}${key}:${ansi.reset} ${ansi.green}${value}${ansi.reset}`;
  }
  if (key === 'error' || key === 'pushError') {
    return `  ${ansi.gray}${key}:${ansi.reset} ${ansi.red}${value}${ansi.reset}`;
  }

  if (event === 'run_completed') {
    if (key === 'pushesSucceeded' && value !== '0') {
      return `  ${ansi.gray}${key}:${ansi.reset} ${ansi.green}${ansi.bold}${value}${ansi.reset}`;
    }
    if (key === 'pushesFailed' && value !== '0') {
      return `  ${ansi.gray}${key}:${ansi.reset} ${ansi.red}${ansi.bold}${value}${ansi.reset}`;
    }
    if (key === 'batchLimitReached' && value === 'true') {
      return `  ${ansi.gray}${key}:${ansi.reset} ${ansi.yellow}${ansi.bold}${value}${ansi.reset}`;
    }
    if (key === 'eligibleForAttempt' && value !== '0') {
      return `  ${ansi.gray}${key}:${ansi.reset} ${ansi.cyan}${value}${ansi.reset}`;
    }
  }

  if (level === 'warn' && (key === 'dueInstant' || key === 'subscriptionId')) {
    return `  ${ansi.gray}${key}:${ansi.reset} ${ansi.yellow}${value}${ansi.reset}`;
  }

  return `  ${ansi.gray}${key}:${ansi.reset} ${value}`;
}

const DISPLAY_PRIORITY = [
  'skipReason',
  'detail',
  'runId',
  'userId',
  'batchNumber',
  'dueUsersInBatch',
  'claimedUsers',
];

/** Stable, readable key order for common events; otherwise priority keys first then sorted. */
function orderedKeys(event: string, payload: Record<string, unknown>): string[] {
  const preferred: Record<string, string[]> = {
    run_started: [
      'runId',
      'startedAt',
      'allowMultipleRemindersPerDay',
      'bypassNextReminderInstantForCandidates',
      'jobBatchLimit',
      'maxJobBatchesPerRun',
    ],
    run_completed: [
      'runId',
      'elapsedMs',
      'jobBatchesRun',
      'batchLimitReached',
      'candidatesReturned',
      'eligibleForAttempt',
      'pushesAttempted',
      'pushesSucceeded',
      'pushesFailed',
      'subscriptionsDeactivated',
      'skippedNoSubscriptions',
      'skippedNoDueItems',
      'skippedAlreadySentAtClaim',
      'healedAlreadySentToday',
      'skippedDuplicateSendGuard',
      'optimisticMarkFailed',
      'claimLostToConcurrentRun',
      'staleClaimsRecovered',
    ],
    run_failed: ['runId', 'elapsedMs', 'error'],
  };

  const preset = preferred[event];
  const keys = new Set(Object.keys(payload));
  const out: string[] = [];
  if (preset) {
    for (const k of preset) {
      if (keys.has(k)) {
        out.push(k);
        keys.delete(k);
      }
    }
  } else {
    const prioSet = new Set(DISPLAY_PRIORITY);
    for (const k of DISPLAY_PRIORITY) {
      if (keys.has(k)) {
        out.push(k);
        keys.delete(k);
      }
    }
    const rest = [...keys].filter((k) => !prioSet.has(k)).sort();
    return [...out, ...rest];
  }
  const rest = [...keys].sort();
  return [...out, ...rest];
}

function formatHumanBlock(
  event: string,
  payload: Record<string, unknown>,
  level: ReminderJobLogLevel
): string {
  const lines: string[] = [];
  const keys = orderedKeys(event, payload);
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(payload, key)) continue;
    const v = payload[key as keyof typeof payload];
    if (v === undefined) continue;
    lines.push(styleKeyValueLine(key, serializeValue(v), level, event));
  }
  return lines.join('\n');
}

export function logReminderJobEvent(
  level: ReminderJobLogLevel,
  event: string,
  payload: Record<string, unknown>
): void {
  const jsonLine = JSON.stringify({
    level,
    component: 'reminders.job',
    event,
    ...payload,
  });

  if (useJsonReminderLogs()) {
    if (level === 'error') {
      console.error('[reminders][job]', jsonLine);
    } else if (level === 'warn') {
      console.warn('[reminders][job]', jsonLine);
    } else {
      console.log('[reminders][job]', jsonLine);
    }
    return;
  }

  const head = formatLogHead(level, event);
  const block = formatHumanBlock(event, payload, level);
  const text = `${head}\n${block}`;

  if (level === 'error') {
    console.error(text);
  } else if (level === 'warn') {
    console.warn(text);
  } else {
    console.log(text);
  }
}

export function logReminderJobRiskSummary(stats: Record<string, unknown>): void {
  if (useJsonReminderLogs()) {
    console.warn(
      '[reminders][job]',
      JSON.stringify({
        level: 'warn',
        component: 'reminders.job',
        event: 'risk_signals',
        ...stats,
      })
    );
    return;
  }

  const entries = Object.entries(stats).filter(
    ([, v]) => v !== undefined && v !== false && v !== 0
  );
  if (entries.length === 0) return;

  if (!useAnsiStyling()) {
    const lines = entries.map(([k, v]) => `  ${k}: ${serializeValue(v)}`).join('\n');
    console.warn(`[reminders][job] WARN  risk_signals\n${lines}`);
    return;
  }

  const head = `${ansi.gray}[reminders][job]${ansi.reset} ${ansi.yellow}${ansi.bold}WRN${ansi.reset} ${ansi.bold}risk_signals${ansi.reset}`;
  const lines = entries
    .map(([k, v]) => styleKeyValueLine(k, serializeValue(v), 'warn', 'risk_signals'))
    .join('\n');
  console.warn(`${head}\n${lines}`);
}
