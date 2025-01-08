import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { MusicCategory, Track } from '../../core/models/track';

import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { addTrack } from '../../store/actions/actions/track.actions';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent {
  tracks$: Observable<Track[]> = this.store.select('tracks'); // Select tracks from store state
  musicCategories = Object.values(MusicCategory);  // Get available music categories
  isAddTrackFormVisible = false;  // Control visibility of the Add Track form
  newTrack: Partial<Track> = {};  // Initialize newTrack object as a partial Track

  constructor(private store: Store<{ tracks: Track[] }>) { }

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
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.newTrack.coverUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle the audio file selection (file input)
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.newTrack.audioFile = input.files[0];
    }
  }

  // Add a new track (dispatch addTrack action)
  addTrack() {
    const track: Track = {
      id: Date.now(),  // Use the current timestamp as a unique ID
      title: this.newTrack.title!,
      artist: this.newTrack.artist!,
      description: this.newTrack.description,
      duration: 3,  // Placeholder for duration calculation (you can calculate based on the audio file later)
      category: this.newTrack.category!,
      addedDate: new Date(),  // Set the added date as the current date
      coverUrl: this.newTrack.coverUrl!,
      audioFile: this.newTrack.audioFile
    };

    // Dispatch the addTrack action to store the track in the state
    console.log("before dispatch",track)
    this.store.dispatch(addTrack({ track }));
    console.log(" dispatched")


    this.closeAddTrackForm();  // Close the form after adding the track
  }
}
