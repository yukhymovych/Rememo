import { timingSafeEqual } from 'crypto';
import { createHash } from 'crypto';

export interface UndoTokenRecord {
  note_id: string;
  token_hash: string;
  expires_at: Date;
  is_used: boolean;
  log_is_undone: boolean;
  prev_due_at: Date;
  prev_last_reviewed_at: Date | null;
  prev_stability_days: number;
  prev_difficulty: number;
  session_item_ids: string[];
}

export interface UndoRepository {
  getUndoTokenForUpdate: (
    reviewLogId: string,
    userId: string
  ) => Promise<UndoTokenRecord | null>;
  restoreSchedule: (
    userId: string,
    noteId: string,
    snapshot: {
      dueAt: Date;
      lastReviewedAt: Date | null;
      stabilityDays: number;
      difficulty: number;
    }
  ) => Promise<void>;
  restoreSessionItems: (userId: string, sessionItemIds: string[]) => Promise<void>;
  markReviewLogUndone: (reviewLogId: string, userId: string) => Promise<void>;
  markUndoTokenUsed: (reviewLogId: string) => Promise<void>;
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function isTokenMatch(expectedHash: string, providedToken: string): boolean {
  const providedHash = hashToken(providedToken);
  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  const providedBuffer = Buffer.from(providedHash, 'hex');
  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }
  return timingSafeEqual(expectedBuffer, providedBuffer);
}

export async function executeUndoReview(params: {
  userId: string;
  reviewLogId: string;
  undoToken: string;
  repo: UndoRepository;
  nowMs?: number;
}): Promise<
  | { success: true }
  | { success: false; status: 403 | 404 | 409; error: string }
> {
  const nowMs = params.nowMs ?? Date.now();
  const tokenRecord = await params.repo.getUndoTokenForUpdate(
    params.reviewLogId,
    params.userId
  );
  if (!tokenRecord) {
    return { success: false, status: 404, error: 'Undo data not found' };
  }
  if (tokenRecord.is_used || tokenRecord.log_is_undone) {
    return { success: false, status: 409, error: 'Undo already used' };
  }
  if (tokenRecord.expires_at.getTime() < nowMs) {
    return { success: false, status: 409, error: 'Undo window expired' };
  }
  if (!isTokenMatch(tokenRecord.token_hash, params.undoToken)) {
    return { success: false, status: 403, error: 'Undo token mismatch' };
  }

  // Invariant: schedule is overwritten during grade, so undo must restore
  // exact pre-grade snapshot fields to make queues consistent again.
  await params.repo.restoreSchedule(params.userId, tokenRecord.note_id, {
    dueAt: tokenRecord.prev_due_at,
    lastReviewedAt: tokenRecord.prev_last_reviewed_at,
    stabilityDays: tokenRecord.prev_stability_days,
    difficulty: tokenRecord.prev_difficulty,
  });
  await params.repo.restoreSessionItems(params.userId, tokenRecord.session_item_ids);
  await params.repo.markReviewLogUndone(params.reviewLogId, params.userId);
  await params.repo.markUndoTokenUsed(params.reviewLogId);

  return { success: true };
}
