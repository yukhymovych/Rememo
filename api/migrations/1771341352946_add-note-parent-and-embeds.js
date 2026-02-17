/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = async (pgm) => {
  pgm.addColumn('notes', {
    parent_id: {
      type: 'uuid',
      notNull: false,
      references: 'notes',
      onDelete: 'CASCADE',
    },
  }, { ifNotExists: true });

  pgm.createTable('note_embeds', {
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    host_note_id: {
      type: 'uuid',
      notNull: true,
      references: 'notes',
      onDelete: 'CASCADE',
    },
    embedded_note_id: {
      type: 'uuid',
      notNull: true,
      references: 'notes',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  }, { ifNotExists: true });

  pgm.createIndex('note_embeds', ['user_id', 'host_note_id'], { ifNotExists: true });
  pgm.createIndex('note_embeds', 'embedded_note_id', { ifNotExists: true });
  pgm.createIndex('note_embeds', ['user_id', 'host_note_id', 'embedded_note_id'], {
    unique: true,
    ifNotExists: true,
    name: 'note_embeds_user_host_embedded_unique',
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = async (pgm) => {
  pgm.dropTable('note_embeds', { ifExists: true });
  pgm.dropColumn('notes', 'parent_id', { ifExists: true });
};
