import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVoiceRecording } from '../voice-recording.model';
import { VoiceRecordingService } from '../service/voice-recording.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './voice-recording-delete-dialog.component.html',
})
export class VoiceRecordingDeleteDialogComponent {
  voiceRecording?: IVoiceRecording;

  constructor(protected voiceRecordingService: VoiceRecordingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.voiceRecordingService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
