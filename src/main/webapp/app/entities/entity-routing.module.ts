import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'sos-button',
        data: { pageTitle: 'SOSButtons' },
        loadChildren: () => import('./sos-button/sos-button.module').then(m => m.SOSButtonModule),
      },
      {
        path: 'contacts',
        data: { pageTitle: 'Contacts' },
        loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule),
      },
      {
        path: 'voice-recording',
        data: { pageTitle: 'VoiceRecordings' },
        loadChildren: () => import('./voice-recording/voice-recording.module').then(m => m.VoiceRecordingModule),
      },
      {
        path: 'chat-message',
        data: { pageTitle: 'ChatMessages' },
        loadChildren: () => import('./chat-message/chat-message.module').then(m => m.ChatMessageModule),
      },
      {
        path: 'user-chat-history',
        data: { pageTitle: 'UserChatHistories' },
        loadChildren: () => import('./user-chat-history/user-chat-history.module').then(m => m.UserChatHistoryModule),
      },
      {
        path: 'danger-zone',
        data: { pageTitle: 'DangerZones' },
        loadChildren: () => import('./danger-zone/danger-zone.module').then(m => m.DangerZoneModule),
      },
      {
        path: 'live-location',
        data: { pageTitle: 'LiveLocations' },
        loadChildren: () => import('./live-location/live-location.module').then(m => m.LiveLocationModule),
      },
      {
        path: 'police-station',
        data: { pageTitle: 'PoliceStations' },
        loadChildren: () => import('./police-station/police-station.module').then(m => m.PoliceStationModule),
      },
      {
        path: 'hospital',
        data: { pageTitle: 'Hospitals' },
        loadChildren: () => import('./hospital/hospital.module').then(m => m.HospitalModule),
      },

      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
