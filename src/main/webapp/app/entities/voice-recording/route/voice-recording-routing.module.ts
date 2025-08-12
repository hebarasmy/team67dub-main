import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VoiceRecordingComponent } from '../list/voice-recording.component';
import { VoiceRecordingDetailComponent } from '../detail/voice-recording-detail.component';
import { VoiceRecordingUpdateComponent } from '../update/voice-recording-update.component';
import { VoiceRecordingRoutingResolveService } from './voice-recording-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const voiceRecordingRoute: Routes = [
  {
    path: '',
    component: VoiceRecordingComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VoiceRecordingDetailComponent,
    resolve: {
      voiceRecording: VoiceRecordingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VoiceRecordingUpdateComponent,
    resolve: {
      voiceRecording: VoiceRecordingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VoiceRecordingUpdateComponent,
    resolve: {
      voiceRecording: VoiceRecordingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(voiceRecordingRoute)],
  exports: [RouterModule],
})
export class VoiceRecordingRoutingModule {}
