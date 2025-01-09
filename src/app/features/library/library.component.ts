import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { MusicCategory, Track } from '../../core/models/track';

import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { addTrack } from '../../store/actions/actions/track.actions';
import { CommonModule } from '@angular/common';
import { TrackService } from '../../core/services/track.service';


@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent {
  tracks$: Observable<Track[]> = this.store.select('tracks'); // Tracks observable from the store
  musicCategories = Object.values(MusicCategory);  // Available music categories
  isAddTrackFormVisible = false;  // Control visibility of the Add Track form
  newTrack: Partial<Track> = {};  // Initialize newTrack object as a partial Track

  constructor(private store: Store<{ tracks: Track[] }>, private trackService: TrackService) { }

  ngOnInit() {
    // Load tracks from IndexedDB and update the store
    this.trackService.getTracks().subscribe(tracks => {
      tracks.forEach(track => this.store.dispatch(addTrack({ track })));
    });
  }

  // Open the form to add a new track
  openAddTrackForm() {
    this.isAddTrackFormVisible = true;
  }

  // Close the Add Track form
  closeAddTrackForm() {
    this.isAddTrackFormVisible = false;
  }

  // Handle the cover image selection (file input)
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

  // Handle the audio file selection (file input)
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.newTrack.audioFile = input.files[0];
    }
  }

  // Add a new track and update the store
  addTrack() {
    const track: Track = {
      id: Date.now(),  // Generate a unique ID using the current timestamp
      title: this.newTrack.title!,
      artist: this.newTrack.artist!,
      description: this.newTrack.description,
      duration: 3,  // Placeholder for duration calculation
      category: this.newTrack.category!,
      addedDate: new Date(),  // Current date as added date
      coverUrl: this.newTrack.coverUrl!,
      audioFile: this.newTrack.audioFile
    };

    // Dispatch addTrack action to update the store
    this.store.dispatch(addTrack({ track }));
    this.closeAddTrackForm();  // Close the form after adding the track
  }
}
