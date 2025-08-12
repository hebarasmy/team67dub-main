import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserChatHistory, NewUserChatHistory } from '../user-chat-history.model';

export type PartialUpdateUserChatHistory = Partial<IUserChatHistory> & Pick<IUserChatHistory, 'id'>;

type RestOf<T extends IUserChatHistory | NewUserChatHistory> = Omit<T, 'messageDateTime'> & {
  messageDateTime?: string | null;
};

export type RestUserChatHistory = RestOf<IUserChatHistory>;

export type NewRestUserChatHistory = RestOf<NewUserChatHistory>;

export type PartialUpdateRestUserChatHistory = RestOf<PartialUpdateUserChatHistory>;

export type EntityResponseType = HttpResponse<IUserChatHistory>;
export type EntityArrayResponseType = HttpResponse<IUserChatHistory[]>;

@Injectable({ providedIn: 'root' })
export class UserChatHistoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-chat-histories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userChatHistory: NewUserChatHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userChatHistory);
    return this.http
      .post<RestUserChatHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(userChatHistory: IUserChatHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userChatHistory);
    return this.http
      .put<RestUserChatHistory>(`${this.resourceUrl}/${this.getUserChatHistoryIdentifier(userChatHistory)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(userChatHistory: PartialUpdateUserChatHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userChatHistory);
    return this.http
      .patch<RestUserChatHistory>(`${this.resourceUrl}/${this.getUserChatHistoryIdentifier(userChatHistory)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestUserChatHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestUserChatHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserChatHistoryIdentifier(userChatHistory: Pick<IUserChatHistory, 'id'>): number {
    return userChatHistory.id;
  }

  compareUserChatHistory(o1: Pick<IUserChatHistory, 'id'> | null, o2: Pick<IUserChatHistory, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserChatHistoryIdentifier(o1) === this.getUserChatHistoryIdentifier(o2) : o1 === o2;
  }

  addUserChatHistoryToCollectionIfMissing<Type extends Pick<IUserChatHistory, 'id'>>(
    userChatHistoryCollection: Type[],
    ...userChatHistoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userChatHistories: Type[] = userChatHistoriesToCheck.filter(isPresent);
    if (userChatHistories.length > 0) {
      const userChatHistoryCollectionIdentifiers = userChatHistoryCollection.map(
        userChatHistoryItem => this.getUserChatHistoryIdentifier(userChatHistoryItem)!
      );
      const userChatHistoriesToAdd = userChatHistories.filter(userChatHistoryItem => {
        const userChatHistoryIdentifier = this.getUserChatHistoryIdentifier(userChatHistoryItem);
        if (userChatHistoryCollectionIdentifiers.includes(userChatHistoryIdentifier)) {
          return false;
        }
        userChatHistoryCollectionIdentifiers.push(userChatHistoryIdentifier);
        return true;
      });
      return [...userChatHistoriesToAdd, ...userChatHistoryCollection];
    }
    return userChatHistoryCollection;
  }

  protected convertDateFromClient<T extends IUserChatHistory | NewUserChatHistory | PartialUpdateUserChatHistory>(
    userChatHistory: T
  ): RestOf<T> {
    return {
      ...userChatHistory,
      messageDateTime: userChatHistory.messageDateTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restUserChatHistory: RestUserChatHistory): IUserChatHistory {
    return {
      ...restUserChatHistory,
      messageDateTime: restUserChatHistory.messageDateTime ? dayjs(restUserChatHistory.messageDateTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestUserChatHistory>): HttpResponse<IUserChatHistory> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestUserChatHistory[]>): HttpResponse<IUserChatHistory[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
