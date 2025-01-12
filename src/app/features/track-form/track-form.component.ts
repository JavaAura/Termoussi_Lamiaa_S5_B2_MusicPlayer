import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MusicCategory, Track } from '../../core/models/track';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from 'express';
import { addTrack, loadTracks } from '../../store/actions/actions/track.actions';

@Component({
  selector: 'app-track-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './track-form.component.html',
  styleUrl: './track-form.component.scss'
})
export class TrackFormComponent {
  @Output() closeModal = new EventEmitter<void>();

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

  closeForm() {
    this.resetForm();
    this.closeModal.emit();
  }

  addTrack() {
    if (this.isFormValid()) {
      const track: Track = {
        id: Date.now(),
        title: this.newTrack.title!,
        artist: this.newTrack.artist!,
        description: this.newTrack.description,
        duration: 3,
        category: this.newTrack.category!,
        addedDate: new Date(),
        coverUrl: this.newTrack.coverUrl!,
        audioFile: this.newTrack.audioFile
      };

      this.store.dispatch(addTrack({ track }));
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
    return !!(
      this.newTrack.title &&
      this.newTrack.artist &&
      this.newTrack.category &&
      this.newTrack.coverUrl &&
      this.newTrack.audioFile
    );
  }
}
