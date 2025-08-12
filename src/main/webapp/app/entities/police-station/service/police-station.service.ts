import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPoliceStation, NewPoliceStation } from '../police-station.model';

export type PartialUpdatePoliceStation = Partial<IPoliceStation> & Pick<IPoliceStation, 'id'>;

export type EntityResponseType = HttpResponse<IPoliceStation>;
export type EntityArrayResponseType = HttpResponse<IPoliceStation[]>;

@Injectable({ providedIn: 'root' })
export class PoliceStationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/police-stations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(policeStation: NewPoliceStation): Observable<EntityResponseType> {
    return this.http.post<IPoliceStation>(this.resourceUrl, policeStation, { observe: 'response' });
  }

  update(policeStation: IPoliceStation): Observable<EntityResponseType> {
    return this.http.put<IPoliceStation>(`${this.resourceUrl}/${this.getPoliceStationIdentifier(policeStation)}`, policeStation, {
      observe: 'response',
    });
  }

  partialUpdate(policeStation: PartialUpdatePoliceStation): Observable<EntityResponseType> {
    return this.http.patch<IPoliceStation>(`${this.resourceUrl}/${this.getPoliceStationIdentifier(policeStation)}`, policeStation, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPoliceStation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPoliceStation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPoliceStationIdentifier(policeStation: Pick<IPoliceStation, 'id'>): number {
    return policeStation.id;
  }

  comparePoliceStation(o1: Pick<IPoliceStation, 'id'> | null, o2: Pick<IPoliceStation, 'id'> | null): boolean {
    return o1 && o2 ? this.getPoliceStationIdentifier(o1) === this.getPoliceStationIdentifier(o2) : o1 === o2;
  }

  addPoliceStationToCollectionIfMissing<Type extends Pick<IPoliceStation, 'id'>>(
    policeStationCollection: Type[],
    ...policeStationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const policeStations: Type[] = policeStationsToCheck.filter(isPresent);
    if (policeStations.length > 0) {
      const policeStationCollectionIdentifiers = policeStationCollection.map(
        policeStationItem => this.getPoliceStationIdentifier(policeStationItem)!
      );
      const policeStationsToAdd = policeStations.filter(policeStationItem => {
        const policeStationIdentifier = this.getPoliceStationIdentifier(policeStationItem);
        if (policeStationCollectionIdentifiers.includes(policeStationIdentifier)) {
          return false;
        }
        policeStationCollectionIdentifiers.push(policeStationIdentifier);
        return true;
      });
      return [...policeStationsToAdd, ...policeStationCollection];
    }
    return policeStationCollection;
  }
}
