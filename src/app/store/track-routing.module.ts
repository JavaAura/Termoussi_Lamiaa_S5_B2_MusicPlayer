import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TrackDetailComponent } from '../features/track-detail/track-detail.component';


const routes: Routes = [
  {
    path: '',
    component: TrackDetailComponent,
  },
 
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackRoutingModule { }
