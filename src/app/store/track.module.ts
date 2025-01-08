import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackRoutingModule } from './track-routing.module';
import { StoreModule } from '@ngrx/store';
import { trackReducer } from './reducers/reducers/track.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TrackEffects } from './effects/effects/track.effects';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TrackRoutingModule,
    StoreModule.forFeature('tracks', trackReducer), 
  ]
})
export class TrackModule { }
