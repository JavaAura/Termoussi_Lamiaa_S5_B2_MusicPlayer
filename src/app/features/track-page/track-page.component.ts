import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrackService } from '../../core/services/track.service';
import { Track } from '../../core/models/track';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-track-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './track-page.component.html',
  styleUrl: './track-page.component.scss'
})
export class TrackPageComponent   {
  currentTrack: Track | null = null;
  volume: number = 0.5; // Default volume
  progress: number = 0; // Default progress
  tracks: Track[] = []; // Local track list

  constructor(
    private route: ActivatedRoute,  // Injecter ActivatedRoute
    private trackService: TrackService
  ) { }

  ngOnInit(): void {
    this.trackService.getTracks().subscribe(tracks => {
      this.tracks = tracks; // Populate the tracks array

      const trackId = this.route.snapshot.paramMap.get('id');
      if (trackId) {
        this.currentTrack = tracks.find(track => track.id.toString() === trackId) || null;
      }

      if (!this.currentTrack && this.tracks.length > 0) {
        this.currentTrack = this.tracks[0];
      }
    });
  }



  togglePlayPause(): void {
    const audioPlayer = <HTMLAudioElement>document.getElementById('audioPlayer');
    if (audioPlayer.paused) {
      audioPlayer.play();
    } else {
      audioPlayer.pause();
    }
  }

  playNext(): void {
    const audioPlayer = <HTMLAudioElement>document.getElementById('audioPlayer');
    if (this.currentTrack) {
      const nextTrackIndex = (this.tracks.indexOf(this.currentTrack) + 1) % this.tracks.length;
      this.currentTrack = this.tracks[nextTrackIndex];
      audioPlayer.src = this.createAudioUrl(this.currentTrack.audioFile);
      audioPlayer.play();
    }
  }

  playPrevious(): void {
    const audioPlayer = <HTMLAudioElement>document.getElementById('audioPlayer');
    if (this.currentTrack) {
      const prevTrackIndex = (this.tracks.indexOf(this.currentTrack) - 1 + this.tracks.length) % this.tracks.length;
      this.currentTrack = this.tracks[prevTrackIndex];
      audioPlayer.src = this.createAudioUrl(this.currentTrack.audioFile);
      audioPlayer.play();
    }
  }

  updateVolume(): void {
    const audioPlayer = <HTMLAudioElement>document.getElementById('audioPlayer');
    audioPlayer.volume = this.volume;
  }

  updateProgress(): void {
    const audioPlayer = <HTMLAudioElement>document.getElementById('audioPlayer');
    audioPlayer.currentTime = (audioPlayer.duration * this.progress) / 100;
  }

  createAudioUrl(blob: Blob | undefined | null): string {
    return blob ? URL.createObjectURL(blob) : '';
  }
}

