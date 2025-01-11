import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, map, Observable, startWith, Subscription } from 'rxjs';
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
  filteredTracks$: Observable<Track[]>;
  musicCategories = Object.values(MusicCategory);
  isAddTrackFormVisible = false;
  newTrack: Partial<Track> = {};
  searchTerm: string = '';
  private searchTerm$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private store: Store<{ tracks: Track[] }>, private trackService: TrackService, private router: Router) {
    this.filteredTracks$ = combineLatest([
      this.tracks$,
      this.searchTerm$
    ]).pipe(
      map(([tracks, searchTerm]) => {
        return tracks.filter(track => track.title.toLowerCase().includes(searchTerm.toLowerCase()));
      })
    );
  }

  ngOnInit() {
    this.store.dispatch(loadTracks());
  }

  onSearch(event: string): void {
    this.searchTerm$.next(event);
  }

  openAddTrackForm() {
    this.isAddTrackFormVisible = true;
  }

  closeAddTrackForm() {
    this.isAddTrackFormVisible = false;
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

    this.store.dispatch(addTrack({ track }));
    this.closeAddTrackForm();
  }

  openTrackPage(track: any) {
    this.router.navigate([`/track/${track.id}`]);
  }
}
