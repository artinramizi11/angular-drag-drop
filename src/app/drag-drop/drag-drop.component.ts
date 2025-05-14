import { Component, inject, signal } from '@angular/core';
import { allNotes } from './data';
import { NgClass } from '@angular/common';
import { AddNoteComponent } from './add-note/add-note.component';
import { CreateNote } from './types/create-note.type';
import { Note } from './types/note.type';
import { AllNotes } from './types/notes.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drag-drop',
  imports: [NgClass,AddNoteComponent],
  templateUrl: './drag-drop.component.html',
  styleUrl: './drag-drop.component.css'
})
export class DragDropComponent {

  router = inject(Router)
  allNotes = allNotes

  allSavedNotes: AllNotes = {
    optionalNotes: [],
    doneNotes: [],
    todoNotes: []
  }


  onDragEnterTarget = signal("")
  addingNewNote = signal(false)

  onAddingNewNote(){
    this.addingNewNote.set(true)
    this.router.navigate([],{queryParams:{addingNewNote: true}})
  }

  onAddNote(note: CreateNote ){
    const newNote: Note = {id: this.allNotes.length + 1,...note}
    this.allNotes.push(newNote)
  }

  onDragEnter(target: string){
    this.onDragEnterTarget.set(target)
    
  }

  onDragStart(event: DragEvent, noteId: number) {
    const note = this.allNotes.find(note => note.id === noteId)
    if(note){
      this.router.navigate([], {queryParams: {dragging: true, noteTitle: note.title}})
      event.dataTransfer?.setData("application/json", JSON.stringify(note))
      
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); 
  }

  onDrop(event: DragEvent,target: keyof typeof this.allSavedNotes) {
    const data = event.dataTransfer?.getData('application/json');
    if (data) {
      this.router.navigate([], {queryParams: {dragging: false}})
      const note = JSON.parse(data)
      this.allNotes = this.allNotes.filter(n => n.id !== note.id)
      this.allSavedNotes[target].push(note)
      this.onDragEnterTarget.set("")
     
    }
  }

  onRemoveNote(note: {id: number,title: string, content: string}, target: keyof typeof this.allSavedNotes){
    this.allNotes = [note, ...this.allNotes]
   this.allSavedNotes[target] = this.allSavedNotes[target].filter(n => n.id !== note.id)
  }
}

