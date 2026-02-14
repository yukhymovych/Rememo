exports.up = async function(pgm) {
  pgm.sql('CREATE EXTENSION IF NOT EXISTS pgcrypto;');

  pgm.createTable('todos', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    title: {
      type: 'text',
      notNull: true,
    },
    completed: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()'),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  });

  pgm.createIndex('todos', 'created_at');
};

exports.down = async function(pgm) {
  pgm.dropTable('todos');
  pgm.sql('DROP EXTENSION IF EXISTS pgcrypto;');
};
