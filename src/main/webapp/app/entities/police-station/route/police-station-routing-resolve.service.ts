import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPoliceStation } from '../police-station.model';
import { PoliceStationService } from '../service/police-station.service';

@Injectable({ providedIn: 'root' })
export class PoliceStationRoutingResolveService implements Resolve<IPoliceStation | null> {
  constructor(protected service: PoliceStationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPoliceStation | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((policeStation: HttpResponse<IPoliceStation>) => {
          if (policeStation.body) {
            return of(policeStation.body);
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
