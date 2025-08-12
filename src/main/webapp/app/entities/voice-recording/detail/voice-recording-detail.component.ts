import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVoiceRecording } from '../voice-recording.model';

@Component({
  selector: 'jhi-voice-recording-detail',
  templateUrl: './voice-recording-detail.component.html',
})
export class VoiceRecordingDetailComponent implements OnInit {
  voiceRecording: IVoiceRecording | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ voiceRecording }) => {
      this.voiceRecording = voiceRecording;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
