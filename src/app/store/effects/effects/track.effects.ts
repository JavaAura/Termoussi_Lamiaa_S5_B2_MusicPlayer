import { Injectable } from '@angular/core';
import { Actions, createEffect,ofType } from '@ngrx/effects';
import { TrackService } from '../../../core/services/track.service';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { addTrackFailure, addTrackSuccess, loadTracksFailure, loadTracksSuccess } from '../../actions/actions/track.actions';
import { addTrack, loadTracks } from '../../actions/actions/track.actions';



@Injectable()
export class TrackEffects {
  constructor(private actions$: Actions, private trackService: TrackService) { }

  addTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTrack),
      tap((action) => console.log('addTrack action triggered:', action)),
      mergeMap(({ track }) =>
        this.trackService.addTrack(track).pipe(
          map(() => addTrackSuccess({ track })),
          catchError(error => of(addTrackFailure({ error })))
        )
      )
    )
  );

  loadTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTracks),
      mergeMap(() =>
        this.trackService.getTracks().pipe(
          map(tracks => loadTracksSuccess({ tracks })),
          catchError(error => of(loadTracksFailure({ error })))
        )
      )
    )
  );
}