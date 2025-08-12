import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VoiceRecordingComponent } from './list/voice-recording.component';
import { VoiceRecordingDetailComponent } from './detail/voice-recording-detail.component';
import { VoiceRecordingUpdateComponent } from './update/voice-recording-update.component';
import { VoiceRecordingDeleteDialogComponent } from './delete/voice-recording-delete-dialog.component';
import { VoiceRecordingRoutingModule } from './route/voice-recording-routing.module';

@NgModule({
  imports: [SharedModule, VoiceRecordingRoutingModule],
  declarations: [
    VoiceRecordingComponent,
    VoiceRecordingDetailComponent,
    VoiceRecordingUpdateComponent,
    VoiceRecordingDeleteDialogComponent,
  ],
})
export class VoiceRecordingModule {}
