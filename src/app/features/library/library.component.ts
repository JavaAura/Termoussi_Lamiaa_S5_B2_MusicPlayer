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
import { TrackFormComponent } from '../track-form/track-form.component';


@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule,
    FormsModule, TrackFormComponent],
  
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent {
  tracks$: Observable<Track[]> = this.store.select('tracks');
  filteredTracks$: Observable<Track[]>;
  isAddTrackFormVisible = false;
  searchTerm: string = '';
  private searchTerm$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private store: Store<{ tracks: Track[] }>,
    private router: Router
  ) {
    this.filteredTracks$ = combineLatest([
      this.tracks$,
      this.searchTerm$
    ]).pipe(
      map(([tracks, searchTerm]) => {
        return tracks.filter(track =>
          track.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
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

  openTrackPage(track: Track) {
    this.router.navigate([`/track/${track.id}`]);
  }
}
