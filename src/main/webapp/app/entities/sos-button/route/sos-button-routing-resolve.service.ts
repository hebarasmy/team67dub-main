import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISOSButton } from '../sos-button.model';
import { SOSButtonService } from '../service/sos-button.service';

@Injectable({ providedIn: 'root' })
export class SOSButtonRoutingResolveService implements Resolve<ISOSButton | null> {
  constructor(protected service: SOSButtonService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISOSButton | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sOSButton: HttpResponse<ISOSButton>) => {
          if (sOSButton.body) {
            return of(sOSButton.body);
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
