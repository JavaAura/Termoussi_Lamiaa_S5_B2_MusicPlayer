import { Routes } from '@angular/router';
import { LibraryComponent } from './features/library/library.component';
import { TrackPageComponent } from './features/track-page/track-page.component';

export const routes: Routes = [
   
    { path: '', component: LibraryComponent, pathMatch: 'full' },
    { path: 'track/:id', component: TrackPageComponent },
    
];
    