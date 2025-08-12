import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISOSButton, NewSOSButton } from '../sos-button.model';

export type PartialUpdateSOSButton = Partial<ISOSButton> & Pick<ISOSButton, 'id'>;

export type EntityResponseType = HttpResponse<ISOSButton>;
export type EntityArrayResponseType = HttpResponse<ISOSButton[]>;

@Injectable({ providedIn: 'root' })
export class SOSButtonService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sos-buttons');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sOSButton: NewSOSButton): Observable<EntityResponseType> {
    return this.http.post<ISOSButton>(this.resourceUrl, sOSButton, { observe: 'response' });
  }

  update(sOSButton: ISOSButton): Observable<EntityResponseType> {
    return this.http.put<ISOSButton>(`${this.resourceUrl}/${this.getSOSButtonIdentifier(sOSButton)}`, sOSButton, { observe: 'response' });
  }

  partialUpdate(sOSButton: PartialUpdateSOSButton): Observable<EntityResponseType> {
    return this.http.patch<ISOSButton>(`${this.resourceUrl}/${this.getSOSButtonIdentifier(sOSButton)}`, sOSButton, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISOSButton>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISOSButton[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSOSButtonIdentifier(sOSButton: Pick<ISOSButton, 'id'>): number {
    return sOSButton.id;
  }

  compareSOSButton(o1: Pick<ISOSButton, 'id'> | null, o2: Pick<ISOSButton, 'id'> | null): boolean {
    return o1 && o2 ? this.getSOSButtonIdentifier(o1) === this.getSOSButtonIdentifier(o2) : o1 === o2;
  }

  addSOSButtonToCollectionIfMissing<Type extends Pick<ISOSButton, 'id'>>(
    sOSButtonCollection: Type[],
    ...sOSButtonsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sOSButtons: Type[] = sOSButtonsToCheck.filter(isPresent);
    if (sOSButtons.length > 0) {
      const sOSButtonCollectionIdentifiers = sOSButtonCollection.map(sOSButtonItem => this.getSOSButtonIdentifier(sOSButtonItem)!);
      const sOSButtonsToAdd = sOSButtons.filter(sOSButtonItem => {
        const sOSButtonIdentifier = this.getSOSButtonIdentifier(sOSButtonItem);
        if (sOSButtonCollectionIdentifiers.includes(sOSButtonIdentifier)) {
          return false;
        }
        sOSButtonCollectionIdentifiers.push(sOSButtonIdentifier);
        return true;
      });
      return [...sOSButtonsToAdd, ...sOSButtonCollection];
    }
    return sOSButtonCollection;
  }
}
