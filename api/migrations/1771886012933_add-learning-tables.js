/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = async (pgm) => {
  pgm.createTable('study_items', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
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
    is_active: {
      type: 'boolean',
      notNull: true,
      default: true,
    },
    due_at: {
      type: 'timestamptz',
      notNull: true,
    },
    last_reviewed_at: {
      type: 'timestamptz',
      notNull: false,
    },
  }, { ifNotExists: true });

  pgm.createIndex('study_items', ['user_id', 'note_id'], {
    unique: true,
    ifNotExists: true,
    name: 'study_items_user_note_unique',
  });
  pgm.createIndex('study_items', ['user_id', 'is_active', 'due_at'], {
    ifNotExists: true,
    name: 'study_items_user_active_due_idx',
  });

  pgm.createTable('learning_sessions', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    day_key: {
      type: 'varchar(10)',
      notNull: true,
    },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'active',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  }, { ifNotExists: true });

  pgm.createIndex('learning_sessions', ['user_id', 'day_key'], {
    unique: true,
    ifNotExists: true,
    name: 'learning_sessions_user_day_unique',
  });

  pgm.createTable('learning_session_items', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    session_id: {
      type: 'uuid',
      notNull: true,
      references: 'learning_sessions',
      onDelete: 'CASCADE',
    },
    note_id: {
      type: 'uuid',
      notNull: false,
      references: 'notes',
      onDelete: 'SET NULL',
    },
    position: {
      type: 'integer',
      notNull: true,
    },
    state: {
      type: 'varchar(20)',
      notNull: true,
      default: 'pending',
    },
    grade: {
      type: 'varchar(20)',
      notNull: false,
    },
    reviewed_at: {
      type: 'timestamptz',
      notNull: false,
    },
    is_retry: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
  }, { ifNotExists: true });

  pgm.createIndex('learning_session_items', ['session_id', 'state', 'position'], {
    ifNotExists: true,
    name: 'learning_session_items_session_state_position_idx',
  });

  pgm.createTable('review_logs', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
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
    reviewed_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()'),
    },
    grade: {
      type: 'varchar(20)',
      notNull: false,
    },
    source: {
      type: 'varchar(20)',
      notNull: true,
    },
    session_id: {
      type: 'uuid',
      notNull: false,
      references: 'learning_sessions',
      onDelete: 'SET NULL',
    },
  }, { ifNotExists: true });

  pgm.createIndex('review_logs', ['user_id', 'note_id', 'reviewed_at'], {
    ifNotExists: true,
    name: 'review_logs_user_note_reviewed_idx',
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = async (pgm) => {
  pgm.dropTable('review_logs', { ifExists: true });
  pgm.dropTable('learning_session_items', { ifExists: true });
  pgm.dropTable('learning_sessions', { ifExists: true });
  pgm.dropTable('study_items', { ifExists: true });
};
