import { Routes } from '@angular/router';
import { LibraryComponent } from './features/library/library.component';

    export const routes: Routes = [
    
        { path: '', component: LibraryComponent, pathMatch: 'full' }, 
    ];
        