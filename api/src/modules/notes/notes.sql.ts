import { pool } from '../../db/pool.js';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  parent_id: string | null;
  rich_content: unknown;
  content_text: string;
  created_at: Date;
  updated_at: Date;
}

export interface NoteListItem {
  id: string;
  title: string;
  parent_id?: string | null;
  updated_at: Date;
}

export async function getAllNotes(userId: string): Promise<NoteListItem[]> {
  const result = await pool.query(
    'SELECT id, title, parent_id, updated_at FROM notes WHERE user_id = $1 ORDER BY updated_at DESC',
    [userId]
  );
  return result.rows;
}

export async function getNoteById(
  id: string,
  userId: string
): Promise<Note | null> {
  const result = await pool.query(
    'SELECT id, user_id, title, parent_id, rich_content, content_text, created_at, updated_at FROM notes WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return result.rows[0] || null;
}

export async function createNote(
  userId: string,
  title: string,
  richContent: unknown,
  contentText: string,
  parentId: string | null = null
): Promise<Note> {
  const result = await pool.query(
    `INSERT INTO notes (user_id, title, rich_content, content_text, parent_id)
     VALUES ($1, $2, $3::jsonb, $4, $5)
     RETURNING id, user_id, title, parent_id, rich_content, content_text, created_at, updated_at`,
    [userId, title, JSON.stringify(richContent), contentText, parentId]
  );
  return result.rows[0];
}

export async function updateNote(
  id: string,
  userId: string,
  title: string,
  richContent: unknown,
  contentText: string,
  parentId: string | null | undefined = undefined
): Promise<Note | null> {
  // Debug: Log what we're about to save
  console.log('[updateNote SQL] richContent type:', typeof richContent);
  console.log('[updateNote SQL] richContent is array:', Array.isArray(richContent));
  console.log('[updateNote SQL] richContent stringify test:', JSON.stringify(richContent).slice(0, 200));
  
  // Stringify the richContent for PostgreSQL JSONB
  const richContentJson = JSON.stringify(richContent);
  
  if (parentId !== undefined) {
    const result = await pool.query(
      `UPDATE notes SET title = $1, rich_content = $2::jsonb, content_text = $3, parent_id = $4, updated_at = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING id, user_id, title, parent_id, rich_content, content_text, created_at, updated_at`,
      [title, richContentJson, contentText, parentId, id, userId]
    );
    return result.rows[0] || null;
  }
  const result = await pool.query(
    `UPDATE notes SET title = $1, rich_content = $2::jsonb, content_text = $3, updated_at = NOW()
     WHERE id = $4 AND user_id = $5
     RETURNING id, user_id, title, parent_id, rich_content, content_text, created_at, updated_at`,
    [title, richContentJson, contentText, id, userId]
  );
  return result.rows[0] || null;
}

export async function deleteNote(
  id: string,
  userId: string
): Promise<boolean> {
  const result = await pool.query(
    'DELETE FROM notes WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return (result.rowCount ?? 0) > 0;
}
