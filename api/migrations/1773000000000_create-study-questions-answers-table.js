/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = async (pgm) => {
  pgm.createType('study_question_answer_source', ['manual', 'generated']);

  pgm.createTable(
    'study_questions_answers',
    {
      id: {
        type: 'uuid',
        primaryKey: true,
        default: pgm.func('gen_random_uuid()'),
      },
      page_id: {
        type: 'uuid',
        notNull: true,
        references: 'notes',
        onDelete: 'CASCADE',
      },
      question: {
        type: 'text',
        notNull: true,
      },
      answer: {
        type: 'text',
        notNull: true,
      },
      source: {
        type: 'study_question_answer_source',
        notNull: true,
      },
      question_normalized: {
        type: 'text',
        notNull: true,
      },
      answer_normalized: {
        type: 'text',
        notNull: true,
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
    },
    { ifNotExists: true }
  );

  pgm.createIndex('study_questions_answers', 'page_id', {
    ifNotExists: true,
  });

  pgm.createIndex(
    'study_questions_answers',
    ['page_id', 'question_normalized', 'answer_normalized'],
    {
      unique: true,
      ifNotExists: true,
      name: 'study_questions_answers_page_question_answer_unique',
    }
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = async (pgm) => {
  pgm.dropTable('study_questions_answers', { ifExists: true });
  pgm.dropType('study_question_answer_source', { ifExists: true });
};
