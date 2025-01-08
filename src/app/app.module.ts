import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/header/header.component';
import { AppComponent } from './app.component';
import { TrackModule } from './store/track.module';
import { StoreModule } from '@ngrx/store';
import { trackReducer } from './store/reducers/reducers/track.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TrackEffects } from './store/effects/effects/track.effects';
import { BrowserModule } from '@angular/platform-browser';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot({ tracks: trackReducer }), 
    BrowserModule,
    EffectsModule.forRoot([TrackEffects]),
  ]
})
export class AppModule { }
