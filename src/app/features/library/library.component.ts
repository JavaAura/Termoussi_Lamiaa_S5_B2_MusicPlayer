import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { MusicCategory, Track } from '../../core/models/track';

import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { addTrack, loadTracks } from '../../store/actions/actions/track.actions';
import { CommonModule } from '@angular/common';
import { TrackService } from '../../core/services/track.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent {
  tracks$: Observable<Track[]> = this.store.select('tracks');
  musicCategories = Object.values(MusicCategory);  
  isAddTrackFormVisible = false; 
  newTrack: Partial<Track> = {};  

  constructor(private store: Store<{ tracks: Track[] }>, private trackService: TrackService, private router: Router) { }

  ngOnInit() {
    this.store.dispatch(loadTracks());
    
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

    // Dispatch addTrack action to update the store
    this.store.dispatch(addTrack({ track }));
    this.closeAddTrackForm();  
  }
  
  openTrackPage(track: any) {
    console.log(track);
    this.router.navigate([`/track/${track.id}`]);
  }
}
