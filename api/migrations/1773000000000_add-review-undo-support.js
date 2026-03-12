/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = async (pgm) => {
  pgm.addColumn('review_logs', {
    is_undone: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    undone_at: {
      type: 'timestamptz',
      notNull: false,
    },
  }, { ifNotExists: true });

  pgm.createIndex('review_logs', ['user_id', 'note_id', 'review_day_key'], {
    unique: true,
    where: "is_undone = false AND review_day_key IS NOT NULL",
    ifNotExists: true,
    name: 'review_logs_user_note_day_active_unique',
  });

  pgm.createTable('review_undo_tokens', {
    review_log_id: {
      type: 'uuid',
      primaryKey: true,
      references: 'review_logs',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    note_id: {
      type: 'uuid',
      notNull: true,
      references: 'notes',
      onDelete: 'CASCADE',
    },
    token_hash: {
      type: 'text',
      notNull: true,
    },
    expires_at: {
      type: 'timestamptz',
      notNull: true,
    },
    is_used: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    used_at: {
      type: 'timestamptz',
      notNull: false,
    },
    prev_due_at: {
      type: 'timestamptz',
      notNull: true,
    },
    prev_last_reviewed_at: {
      type: 'timestamptz',
      notNull: false,
    },
    prev_stability_days: {
      type: 'real',
      notNull: true,
    },
    prev_difficulty: {
      type: 'real',
      notNull: true,
    },
    session_item_ids: {
      type: 'uuid[]',
      notNull: true,
      default: '{}',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  }, { ifNotExists: true });

  pgm.createIndex('review_undo_tokens', ['user_id', 'expires_at'], {
    where: 'is_used = false',
    ifNotExists: true,
    name: 'review_undo_tokens_user_expires_active_idx',
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = async (pgm) => {
  pgm.dropIndex('review_undo_tokens', ['user_id', 'expires_at'], {
    ifExists: true,
    name: 'review_undo_tokens_user_expires_active_idx',
  });
  pgm.dropTable('review_undo_tokens', { ifExists: true });

  pgm.dropIndex('review_logs', ['user_id', 'note_id', 'review_day_key'], {
    ifExists: true,
    name: 'review_logs_user_note_day_active_unique',
  });

  pgm.dropColumn('review_logs', ['is_undone', 'undone_at'], { ifExists: true });
};
