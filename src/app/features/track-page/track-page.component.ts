import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, SelectMultipleControlValueAccessor } from '@angular/forms';
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
export class TrackPageComponent  {
  currentTrack: Track | null = null;
  volume: number = 0.5; 
  progress: number = 0; 
  tracks: Track[] = []; 
  trackProgress: Map<number, number> = new Map(); 

  constructor(
    private route: ActivatedRoute,  
    private trackService: TrackService
  ) { }

  ngOnInit(): void {
    this.trackService.getTracks().subscribe((tracks) => {
      this.tracks = tracks;

      // Determine the initial track
      const trackId = this.route.snapshot.paramMap.get('id');
      if (trackId) {
        this.currentTrack = tracks.find((track) => track.id.toString() === trackId) || null;
      }
      if (!this.currentTrack && this.tracks.length > 0) {
        this.currentTrack = this.tracks[0];
      }

      if (this.currentTrack) {
        this.initializeAudioPlayer();
      }
   
    // this.trackService.getTracks().subscribe(tracks => {
    //   this.tracks = tracks; 

    //   const trackId = this.route.snapshot.paramMap.get('id');
    //   if (trackId) {
    //     this.currentTrack = tracks.find(track => track.id.toString() === trackId) || null;
    //   }

    //   if (!this.currentTrack && this.tracks.length > 0) {
    //     this.currentTrack = this.tracks[0];
    //   }
      
    //   if (this.currentTrack) {
    //     const savedProgress = localStorage.getItem(`track-${this.currentTrack.id}-progress`);
    //     if (savedProgress) {
    //       const audioPlayer = <HTMLAudioElement>document.getElementById('audioPlayer');
    //       if (audioPlayer) {
    //         audioPlayer.currentTime = parseFloat(savedProgress);
    //       }
    //     }
    //   }
     
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.saveProgress();
      });
    }
    });
  }


  initializeAudioPlayer(): void {
    const audioPlayer = <HTMLAudioElement>document.getElementById('audioPlayer');
    console.log(audioPlayer)
    if (audioPlayer && this.currentTrack) {
      
      audioPlayer.src = this.createAudioUrl(this.currentTrack.audioFile);

      // Restore saved progress if available
      const savedProgress = localStorage.getItem(`track-${this.currentTrack.id}-progress`);
      if (savedProgress) {
        audioPlayer.currentTime = parseFloat(savedProgress);
      }

      // Optional: Play the track automatically
      audioPlayer.play();
    }
  }
  saveProgress(): void {
    const audioPlayer = <HTMLAudioElement>document.getElementById('audioPlayer');
    if (audioPlayer && this.currentTrack) {
      const currentTime = audioPlayer.currentTime;
      localStorage.setItem(`track-${this.currentTrack.id}-progress`, currentTime.toString());
    }
  }

  

  togglePlayPause(): void {
    const audioPlayer = <HTMLAudioElement>document.getElementById('audioPlayer');
    if (audioPlayer.paused) {
      audioPlayer.play();
    } else {
      audioPlayer.pause();
      this.saveProgress(); 
    }
  }

  playNext(): void {
    const audioPlayer = <HTMLAudioElement>document.getElementById('audioPlayer');
    if (this.currentTrack) {
      this.saveProgress(); 
      const nextTrackIndex = (this.tracks.indexOf(this.currentTrack) + 1) % this.tracks.length;
      this.currentTrack = this.tracks[nextTrackIndex];
      audioPlayer.src = this.createAudioUrl(this.currentTrack.audioFile);

      // Load saved progress for the next track
      const savedProgress = localStorage.getItem(`track-${this.currentTrack.id}-progress`);
      if (savedProgress) {
        audioPlayer.currentTime = parseFloat(savedProgress);
      }

      audioPlayer.play();
    }
  }

  playPrevious(): void {
    const audioPlayer = <HTMLAudioElement>document.getElementById('audioPlayer');
    if (this.currentTrack) {
      this.saveProgress(); 
      const prevTrackIndex = (this.tracks.indexOf(this.currentTrack) - 1 + this.tracks.length) % this.tracks.length;
      this.currentTrack = this.tracks[prevTrackIndex];
      audioPlayer.src = this.createAudioUrl(this.currentTrack.audioFile);

      // Load saved progress for the previous track
      const savedProgress = localStorage.getItem(`track-${this.currentTrack.id}-progress`);
      if (savedProgress) {
        audioPlayer.currentTime = parseFloat(savedProgress);
      }


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

