import { Component, effect, EventEmitter, inject, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateNote } from '../types/create-note.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-note',
  imports: [ReactiveFormsModule],
  templateUrl: './add-note.component.html',
  styleUrl: './add-note.component.css'
})
export class AddNoteComponent implements OnInit  {

  @Output() closeModal = new EventEmitter()
  @Output() addNote = new EventEmitter<CreateNote>()
  router = inject(Router)

  noteForm = new FormGroup({
    title: new FormControl("",[Validators.minLength(5)]),
    content: new FormControl("",[Validators.minLength(5)])

  })

  ngOnInit(): void {
    this.noteForm.valueChanges.subscribe({next:(data) => {
      this.router.navigate([], {queryParams: {title: data.title || null, content: data.content || null}})
    }})
  }
 


  onSaveNote(){
    if(this.noteForm.valid){
      this.addNote.emit(this.noteForm.value as CreateNote)
      this.closeModal.emit()
      this.router.navigate([],{queryParams: {newNoteAdded: true}})
    } else {
      alert("Some fields are invalid, make sure you dont have a red color in inputs")
    }
  }


}
