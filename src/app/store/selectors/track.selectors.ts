
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Track } from '../../core/models/track';


export interface TrackState {
    tracks: Track[];
    selectedTrackId: string | null;
    loading: boolean;
    error: any;
}

// Feature selector for the Track state
export const selectTrackState = createFeatureSelector<TrackState>('track');

// Selector for all tracks
export const selectAllTracks = createSelector(
    selectTrackState,
    (state: TrackState) => state.tracks
);

// Selector for the selected track ID
export const selectSelectedTrackId = createSelector(
    selectTrackState,
    (state: TrackState) => state.selectedTrackId
);

// Selector for the currently selected track
export const selectCurrentTrack = createSelector(
    selectAllTracks,
    selectSelectedTrackId,
    (tracks, selectedTrackId) =>
        tracks.find(track => track.id === Number(selectedTrackId)) || null
);

// Selector for loading state
export const selectTrackLoading = createSelector(
    selectTrackState,
    (state: TrackState) => state.loading
);

// Selector for error state
export const selectTrackError = createSelector(
    selectTrackState,
    (state: TrackState) => state.error
);