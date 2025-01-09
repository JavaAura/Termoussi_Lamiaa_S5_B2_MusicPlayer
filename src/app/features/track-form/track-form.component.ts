import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MusicCategory, Track } from '../../core/models/track';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-track-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './track-form.component.html',
  styleUrl: './track-form.component.scss'
})
export class TrackFormComponent {
  
}
