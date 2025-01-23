import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MusicCategory, Track } from '../../core/models/track';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from 'express';
import { addTrack, loadTracks, updateTrack } from '../../store/actions/actions/track.actions';

@Component({
  selector: 'app-track-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './track-form.component.html',
  styleUrl: './track-form.component.scss'
})
export class TrackFormComponent implements OnChanges {
  @Output() closeModal = new EventEmitter<void>();
  @Input() track: Track | null = null;

  musicCategories = Object.values(MusicCategory);

  newTrack: Partial<Track> = {
    title: '',
    artist: '',
    description: '',
    category: MusicCategory.OTHER,
    coverUrl: '',
    audioFile: undefined
  };

  constructor(private store: Store<{ tracks: Track[] }>) { }

  ngOnChanges() {
    if (this.track) {

      this.newTrack = {
        ...this.track,
   
        audioFile: undefined
      };
    } else {
      this.resetForm();
    }
  }

  submitForm() {
    if (this.isFormValid()) {
      const trackData: Track = {
        id: this.track?.id || Date.now(),
        title: this.newTrack.title!,
        artist: this.newTrack.artist!,
        description: this.newTrack.description || '',
        duration: this.track?.duration || 0,
        category: this.newTrack.category!,
        addedDate: this.track?.addedDate || new Date(),
        coverUrl: this.newTrack.coverUrl!,
        audioFile: this.newTrack.audioFile || this.track?.audioFile
      };

      if (this.track) {
        // Update existing track
        this.store.dispatch(updateTrack({ track: trackData }));
      } else {
        // Add new track
        this.store.dispatch(addTrack({ track: trackData }));
      }

      this.closeForm();
    }
  }

  onCoverSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newTrack.coverUrl = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.newTrack.audioFile = input.files[0];
    }
  }

  closeForm() {
    this.resetForm();
    this.closeModal.emit();
  }

  private resetForm() {
    this.newTrack = {
      title: '',
      artist: '',
      description: '',
      category: MusicCategory.OTHER,
      coverUrl: '',
      audioFile: undefined
    };
  }

  private isFormValid(): boolean {
    const isNewTrack = !this.track;
    const fileRequirements = isNewTrack
      ? this.newTrack.coverUrl && this.newTrack.audioFile 
      : true; 

    return !!(
      this.newTrack.title &&
      this.newTrack.artist &&
      this.newTrack.category &&
      fileRequirements
    );
  }
  
  // @Output() closeModal = new EventEmitter<void>();
  // @Input() track: Track | null = null;
  // @Output() formSubmit = new EventEmitter<Track>();
  // musicCategories = Object.values(MusicCategory);
  // newTrack: Partial<Track> = {
  //   title: '',
  //   artist: '',
  //   description: '',
  //   category: MusicCategory.OTHER,
  //   coverUrl: '',
  //   audioFile: undefined 
  // };

  // constructor(private store: Store<{ tracks: Track[] }>) { }


  // ngOnChanges() {
  //   if (this.track) {
  //     this.newTrack = { ...this.track }; 
  //   } else {
  //     this.resetForm();
  //   }
  // }

  // closeForm() {
  //   this.resetForm();
  //   this.closeModal.emit();
  // }

  // addTrack() {
  //   if (this.isFormValid()) {
  //     const track: Track = {
  //       id: Date.now(),
  //       title: this.newTrack.title!,
  //       artist: this.newTrack.artist!,
  //       description: this.newTrack.description,
  //       duration: 3,
  //       category: this.newTrack.category!,
  //       addedDate: new Date(),
  //       coverUrl: this.newTrack.coverUrl!,
  //       audioFile: this.newTrack.audioFile
  //     };

  //     this.store.dispatch(addTrack({ track }));
  //     this.closeForm();
  //   }
  // }

  // onCoverSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files[0]) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.newTrack.coverUrl = reader.result as string;
  //     };
  //     reader.readAsDataURL(input.files[0]);
  //   }
  // }

  // onFileSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files[0]) {
  //     this.newTrack.audioFile = input.files[0];
  //   }
  // }

  // private resetForm() {
  //   this.newTrack = {
  //     title: '',
  //     artist: '',
  //     description: '',
  //     category: MusicCategory.OTHER, // Consistent default enum value
  //     coverUrl: '',
  //     audioFile: undefined 
  //   };
  // }

  // private isFormValid(): boolean {
  //   return !!(
  //     this.newTrack.title &&
  //     this.newTrack.artist &&
  //     this.newTrack.category &&
  //     this.newTrack.coverUrl &&
  //     this.newTrack.audioFile
  //   );
  // }
}
