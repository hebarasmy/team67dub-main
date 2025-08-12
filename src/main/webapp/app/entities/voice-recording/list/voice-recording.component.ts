import { Component, OnDestroy } from '@angular/core';
import { AudioRecordingService } from '../service/audio-recording.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'jhi-voice-recording',
  templateUrl: './voice-recorder.component.html',
  styleUrls: ['./voice-recorder.component.scss'],
})
export class VoiceRecordingComponent implements OnDestroy {
  isRecording = false;
  recordedTime: any;
  blobUrl: any;
  teste: any;
  currentDateTime: any;
  recordings: any[] = [];
  private dateTimeInterval: any;

  constructor(private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer) {
    this.audioRecordingService.recordingFailed().subscribe(() => (this.isRecording = false));
    this.audioRecordingService.getRecordedTime().subscribe(time => (this.recordedTime = time));
    this.audioRecordingService.getRecordedBlob().subscribe(data => {
      this.recordings.push({
        blob: data.blob,
        name: `audio_${new Date().getTime()}.mp3`,
        time: new Date().toLocaleString('default', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      });
    });
  }

  ngOnInit() {
    this.updateDateTime();
    this.dateTimeInterval = setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  updateDateTime() {
    const now = new Date();
    this.currentDateTime = now.toLocaleString('default', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  startRecording() {
    this.isRecording = true;
    this.audioRecordingService.startRecording();
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.recordings = [];
  }

  ngOnDestroy(): void {
    this.abortRecording();
    clearInterval(this.dateTimeInterval);
  }

  playRecording(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  download(blob: Blob, name: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  }

  sanitizeUrl(blob: Blob): any {
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
  }

  trackId(index: number, item: any): any {
    return item.id;
  }
  save(): void {
    const url = window.URL.createObjectURL(this.teste.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.teste.title;
    link.click();
  }

}
