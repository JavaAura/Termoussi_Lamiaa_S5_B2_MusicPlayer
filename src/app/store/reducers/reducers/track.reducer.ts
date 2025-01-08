import { createReducer, on } from '@ngrx/store';
import {  addTrack} from '../../actions/actions/track.actions';
import { Track } from '../../../core/models/track';

export const initialState: Track[] = [];

// Reducer function to handle the actions for tracks
const _trackReducer = createReducer(
  initialState,

  // Action to add a new track
  on(addTrack, (state, { track }) => [...state, track]),

);

// Exporting the reducer function to be used in the Store
export function trackReducer(state: Track[] = initialState, action: any): Track[] {
  return _trackReducer(state, action);
}