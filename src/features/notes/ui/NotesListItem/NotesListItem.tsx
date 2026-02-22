import type { NotesListItemProps } from './NotesListItem.types';

const listItemStyle: React.CSSProperties = {
  padding: '12px 16px',
  marginBottom: '8px',
  cursor: 'pointer',
};
const titleStyle: React.CSSProperties = { fontWeight: 500, color: 'white' };
const dateStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#6b7280',
  marginTop: '4px',
};

export function NotesListItem({ note, formattedDate, onClick }: NotesListItemProps) {
  return (
    <li style={listItemStyle} onClick={onClick}>
      <div style={titleStyle}>{note.title || 'Untitled'}</div>
      <div style={dateStyle}>{formattedDate}</div>
    </li>
  );
}
