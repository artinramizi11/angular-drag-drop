import { Note } from "./note.type"

export type AllNotes = {
    optionalNotes: Note[],
    doneNotes: Note[],
    todoNotes: Note[]
  }