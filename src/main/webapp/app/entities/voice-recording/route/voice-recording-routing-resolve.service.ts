import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVoiceRecording } from '../voice-recording.model';
import { VoiceRecordingService } from '../service/voice-recording.service';

@Injectable({ providedIn: 'root' })
export class VoiceRecordingRoutingResolveService implements Resolve<IVoiceRecording | null> {
  constructor(protected service: VoiceRecordingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVoiceRecording | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((voiceRecording: HttpResponse<IVoiceRecording>) => {
          if (voiceRecording.body) {
            return of(voiceRecording.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
