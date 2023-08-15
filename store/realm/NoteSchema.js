export const NoteSchema = {
  name: 'Note',
  properties: {
    id: 'int',
    note: 'string',
    date: 'string',
    image: 'string'
  },
  primaryKey: 'id'
}