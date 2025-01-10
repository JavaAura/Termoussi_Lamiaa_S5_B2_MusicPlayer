import { createReducer, on } from '@ngrx/store';
import {  addTrack,  loadTracksSuccess} from '../../actions/actions/track.actions';
import { Track } from '../../../core/models/track';


export const initialState: Track[] = [],
  tracks = [];


const _trackReducer = createReducer(
  initialState,

  on(addTrack, (state, { track }) => [...state, track]),
on(loadTracksSuccess, (state, { tracks }) => [...tracks]),
);

export function trackReducer(state: Track[] = initialState, action: any): Track[] {
  return _trackReducer(state, action);
}