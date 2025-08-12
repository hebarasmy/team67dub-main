import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserChatHistory } from '../user-chat-history.model';
import { UserChatHistoryService } from '../service/user-chat-history.service';

@Injectable({ providedIn: 'root' })
export class UserChatHistoryRoutingResolveService implements Resolve<IUserChatHistory | null> {
  constructor(protected service: UserChatHistoryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserChatHistory | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userChatHistory: HttpResponse<IUserChatHistory>) => {
          if (userChatHistory.body) {
            return of(userChatHistory.body);
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
