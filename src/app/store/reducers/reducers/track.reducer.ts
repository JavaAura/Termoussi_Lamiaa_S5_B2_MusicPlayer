import { createReducer, on } from '@ngrx/store';
import {  addTrack} from '../../actions/actions/track.actions';
import { Track } from '../../../core/models/track';

export const initialState: Track[] = [];

const _trackReducer = createReducer(
  initialState,

  on(addTrack, (state, { track }) => [...state, track]),

);

export function trackReducer(state: Track[] = initialState, action: any): Track[] {
  return _trackReducer(state, action);
}