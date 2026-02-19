import type { DefaultReactSuggestionItem } from '@blocknote/react';

export interface NoteEditorBodyProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any;
  noteTitlesMap: Map<string, string>;
  getSlashMenuItems: (query: string) => Promise<DefaultReactSuggestionItem[]>;
}
