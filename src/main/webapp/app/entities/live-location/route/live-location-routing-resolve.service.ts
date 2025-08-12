import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILiveLocation } from '../live-location.model';
import { LiveLocationService } from '../service/live-location.service';

@Injectable({ providedIn: 'root' })
export class LiveLocationRoutingResolveService implements Resolve<ILiveLocation | null> {
  constructor(protected service: LiveLocationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILiveLocation | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((liveLocation: HttpResponse<ILiveLocation>) => {
          if (liveLocation.body) {
            return of(liveLocation.body);
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
