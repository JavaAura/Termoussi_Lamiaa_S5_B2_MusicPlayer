import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { trackReducer } from './store/reducers/reducers/track.reducer';
import { TrackEffects } from './store/effects/effects/track.effects';

// export const appConfig: ApplicationConfig = {
//   providers: [provideRouter(routes), provideClientHydration()]
// };
// export const appConfig: ApplicationConfig = {
//   providers: [provideRouter(routes), provideStore({ track: trackReducer }), provideEffects()]
// };
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      tracks: trackReducer
    }),
    provideEffects([TrackEffects])
  ]
};