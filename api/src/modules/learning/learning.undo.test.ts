import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'crypto';
import { executeUndoReview, type UndoRepository, type UndoTokenRecord } from './learning.undo.js';

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function makeRecord(overrides: Partial<UndoTokenRecord> = {}): UndoTokenRecord {
  return {
    note_id: randomBytes(16).toString('hex'),
    token_hash: hashToken('token-1'),
    expires_at: new Date(Date.now() + 9_000),
    is_used: false,
    log_is_undone: false,
    prev_due_at: new Date('2026-01-01T00:00:00.000Z'),
    prev_last_reviewed_at: new Date('2025-12-31T00:00:00.000Z'),
    prev_stability_days: 7,
    prev_difficulty: 5,
    session_item_ids: ['item-a', 'item-b'],
    ...overrides,
  };
}

function makeRepo(record: UndoTokenRecord | null) {
  const calls = {
    restoreSchedule: 0,
    restoreSessionItems: 0,
    markReviewLogUndone: 0,
    markUndoTokenUsed: 0,
    restoredSessionItems: [] as string[],
  };
  const repo: UndoRepository = {
    getUndoTokenForUpdate: async () => record,
    restoreSchedule: async () => {
      calls.restoreSchedule += 1;
    },
    restoreSessionItems: async (_userId, sessionItemIds) => {
      calls.restoreSessionItems += 1;
      calls.restoredSessionItems = sessionItemIds;
    },
    markReviewLogUndone: async () => {
      calls.markReviewLogUndone += 1;
    },
    markUndoTokenUsed: async () => {
      calls.markUndoTokenUsed += 1;
    },
  };
  return { repo, calls };
}

test('can undo within window and restores schedule/session state', async () => {
  const record = makeRecord();
  const { repo, calls } = makeRepo(record);
  const result = await executeUndoReview({
    userId: 'user-1',
    reviewLogId: 'review-1',
    undoToken: 'token-1',
    repo,
  });
  assert.equal(result.success, true);
  assert.equal(calls.restoreSchedule, 1);
  assert.equal(calls.restoreSessionItems, 1);
  assert.deepEqual(calls.restoredSessionItems, ['item-a', 'item-b']);
  assert.equal(calls.markReviewLogUndone, 1);
  assert.equal(calls.markUndoTokenUsed, 1);
});

test('cannot undo after window expiration', async () => {
  const expiredRecord = makeRecord({
    expires_at: new Date(Date.now() - 1_000),
  });
  const { repo, calls } = makeRepo(expiredRecord);
  const result = await executeUndoReview({
    userId: 'user-1',
    reviewLogId: 'review-1',
    undoToken: 'token-1',
    repo,
  });
  assert.deepEqual(result, {
    success: false,
    status: 409,
    error: 'Undo window expired',
  });
  assert.equal(calls.restoreSchedule, 0);
});

test('cannot undo twice when token already used', async () => {
  const usedRecord = makeRecord({
    is_used: true,
  });
  const { repo } = makeRepo(usedRecord);
  const result = await executeUndoReview({
    userId: 'user-1',
    reviewLogId: 'review-1',
    undoToken: 'token-1',
    repo,
  });
  assert.deepEqual(result, {
    success: false,
    status: 409,
    error: 'Undo already used',
  });
});

test('undo token mismatch fails', async () => {
  const record = makeRecord();
  const { repo } = makeRepo(record);
  const result = await executeUndoReview({
    userId: 'user-1',
    reviewLogId: 'review-1',
    undoToken: 'token-wrong',
    repo,
  });
  assert.deepEqual(result, {
    success: false,
    status: 403,
    error: 'Undo token mismatch',
  });
});
