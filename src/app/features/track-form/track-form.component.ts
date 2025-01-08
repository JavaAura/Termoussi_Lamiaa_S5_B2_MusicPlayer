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
  @Input() trackToUpdate: Track | null = null;
  @Output() trackSaved = new EventEmitter<Track>();
  track: Track = {
    id: 0,
    title: '',
    artist: '',
    description: '',
    duration: 0,
    category: MusicCategory.POP,
    addedDate: new Date(),
    coverUrl: '',
    audioFile: undefined
  };

  formVisible: boolean = true;
  errorMessage: string | null = null;

  categories = Object.values(MusicCategory);

  ngOnInit(): void {
    if (this.trackToUpdate) {
      this.track = { ...this.trackToUpdate };
    }
  }

  onSaveTrack(): void {
    this.trackSaved.emit(this.track);
  }

  toggleTrackForm(): void {
    this.formVisible = !this.formVisible;
  }

  onCoverFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.track.coverUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  onAudioFileChange(event: any): void {
    const file = event.target.files[0]; // Get the first file from the input
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        // Ensure result is not null and is an ArrayBuffer
        if (result && result instanceof ArrayBuffer) {
          // Now create a Blob from the ArrayBuffer
          this.track.audioFile = new Blob([result], { type: file.type });
          console.log("File loaded successfully", this.track.audioFile);
        } else {
          console.error("Unexpected result type", result);
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
    } else {
      console.error("No file selected or file is not readable");
    }
  }
}
