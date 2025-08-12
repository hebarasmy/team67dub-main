import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILiveLocation, NewLiveLocation } from '../live-location.model';

export type PartialUpdateLiveLocation = Partial<ILiveLocation> & Pick<ILiveLocation, 'id'>;

export type EntityResponseType = HttpResponse<ILiveLocation>;
export type EntityArrayResponseType = HttpResponse<ILiveLocation[]>;

@Injectable({ providedIn: 'root' })
export class LiveLocationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/live-locations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(liveLocation: NewLiveLocation): Observable<EntityResponseType> {
    return this.http.post<ILiveLocation>(this.resourceUrl, liveLocation, { observe: 'response' });
  }

  update(liveLocation: ILiveLocation): Observable<EntityResponseType> {
    return this.http.put<ILiveLocation>(`${this.resourceUrl}/${this.getLiveLocationIdentifier(liveLocation)}`, liveLocation, {
      observe: 'response',
    });
  }

  partialUpdate(liveLocation: PartialUpdateLiveLocation): Observable<EntityResponseType> {
    return this.http.patch<ILiveLocation>(`${this.resourceUrl}/${this.getLiveLocationIdentifier(liveLocation)}`, liveLocation, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILiveLocation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILiveLocation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLiveLocationIdentifier(liveLocation: Pick<ILiveLocation, 'id'>): number {
    return liveLocation.id;
  }

  compareLiveLocation(o1: Pick<ILiveLocation, 'id'> | null, o2: Pick<ILiveLocation, 'id'> | null): boolean {
    return o1 && o2 ? this.getLiveLocationIdentifier(o1) === this.getLiveLocationIdentifier(o2) : o1 === o2;
  }

  addLiveLocationToCollectionIfMissing<Type extends Pick<ILiveLocation, 'id'>>(
    liveLocationCollection: Type[],
    ...liveLocationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const liveLocations: Type[] = liveLocationsToCheck.filter(isPresent);
    if (liveLocations.length > 0) {
      const liveLocationCollectionIdentifiers = liveLocationCollection.map(
        liveLocationItem => this.getLiveLocationIdentifier(liveLocationItem)!
      );
      const liveLocationsToAdd = liveLocations.filter(liveLocationItem => {
        const liveLocationIdentifier = this.getLiveLocationIdentifier(liveLocationItem);
        if (liveLocationCollectionIdentifiers.includes(liveLocationIdentifier)) {
          return false;
        }
        liveLocationCollectionIdentifiers.push(liveLocationIdentifier);
        return true;
      });
      return [...liveLocationsToAdd, ...liveLocationCollection];
    }
    return liveLocationCollection;
  }
}
