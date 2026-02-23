import { DEFAULT_NOTE_TITLE } from '../model/types';
import { ensureBlocksArray, appendEmbeddedPageBlock } from './blocks';

type BlockLike = { type?: string; props?: { noteId?: string }; content?: unknown[] };

export interface CreateChildNoteDeps {
  createNote: (payload: {
    title: string;
    parent_id: string | null;
    rich_content: unknown[];
  }) => Promise<{ id: string }>;
  updateNote: (id: string, payload: { title: string; rich_content: unknown }) => Promise<unknown>;
  getParentNote: (parentId: string) => Promise<{ title?: string; rich_content?: unknown } | null>;
}

export async function createChildNote(
  parentId: string,
  deps: CreateChildNoteDeps
): Promise<{ id: string }> {
  const child = await deps.createNote({
    title: DEFAULT_NOTE_TITLE,
    parent_id: parentId,
    rich_content: [{ type: 'paragraph', content: [] }],
  });

  try {
    const parent = await deps.getParentNote(parentId);
    const parentBlocks = ensureBlocksArray(parent?.rich_content) as BlockLike[];
    const updatedBlocks = appendEmbeddedPageBlock(parentBlocks, child.id);

    await deps.updateNote(parentId, {
      title: parent?.title?.trim() || DEFAULT_NOTE_TITLE,
      rich_content: updatedBlocks,
    });
  } catch (e) {
    console.warn('Failed to append embedded page block to parent note', e);
  }

  return child;
}
