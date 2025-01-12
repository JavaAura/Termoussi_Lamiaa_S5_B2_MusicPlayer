import { createReducer, on } from '@ngrx/store';
import { addTrack, deleteTrackSuccess, loadTracksSuccess, updateTrackSuccess } from '../../actions/actions/track.actions';
import { Track } from '../../../core/models/track';


export const initialState: Track[] = [],
  tracks = [];


const _trackReducer = createReducer(
  initialState,

  on(addTrack, (state, { track }) => [...state, track]),
  on(loadTracksSuccess, (state, { tracks }) => [...tracks]),
  on(deleteTrackSuccess, (state, { id }) => state.filter(track => track.id !== id)),
  on(updateTrackSuccess, (state, { track }) =>
    state.map(t => t.id === track.id ? { ...t, ...track } : t)
  )
);

export function trackReducer(state: Track[] = initialState, action: any): Track[] {
  return _trackReducer(state, action);
}