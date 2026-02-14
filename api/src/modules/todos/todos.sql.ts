import { pool } from '../../db/pool.js';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export async function getAllTodos(): Promise<Todo[]> {
  const result = await pool.query(
    'SELECT id, title, completed, created_at, updated_at FROM todos ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function createTodo(title: string): Promise<Todo> {
  const result = await pool.query(
    'INSERT INTO todos (title) VALUES ($1) RETURNING id, title, completed, created_at, updated_at',
    [title]
  );
  return result.rows[0];
}

export async function updateTodo(
  id: string,
  updates: { title?: string; completed?: boolean }
): Promise<Todo | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updates.title !== undefined) {
    fields.push(`title = $${paramIndex++}`);
    values.push(updates.title);
  }

  if (updates.completed !== undefined) {
    fields.push(`completed = $${paramIndex++}`);
    values.push(updates.completed);
  }

  if (fields.length === 0) {
    const result = await pool.query(
      'SELECT id, title, completed, created_at, updated_at FROM todos WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await pool.query(
    `UPDATE todos SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, title, completed, created_at, updated_at`,
    values
  );

  return result.rows[0] || null;
}

export async function deleteTodo(id: string): Promise<boolean> {
  const result = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}
