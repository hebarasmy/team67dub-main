import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDangerZone, NewDangerZone } from '../danger-zone.model';

export type PartialUpdateDangerZone = Partial<IDangerZone> & Pick<IDangerZone, 'id'>;

export type EntityResponseType = HttpResponse<IDangerZone>;
export type EntityArrayResponseType = HttpResponse<IDangerZone[]>;

@Injectable({ providedIn: 'root' })
export class DangerZoneService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/danger-zones');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(dangerZone: NewDangerZone): Observable<EntityResponseType> {
    return this.http.post<IDangerZone>(this.resourceUrl, dangerZone, { observe: 'response' });
  }

  update(dangerZone: IDangerZone): Observable<EntityResponseType> {
    return this.http.put<IDangerZone>(`${this.resourceUrl}/${this.getDangerZoneIdentifier(dangerZone)}`, dangerZone, {
      observe: 'response',
    });
  }

  partialUpdate(dangerZone: PartialUpdateDangerZone): Observable<EntityResponseType> {
    return this.http.patch<IDangerZone>(`${this.resourceUrl}/${this.getDangerZoneIdentifier(dangerZone)}`, dangerZone, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDangerZone>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDangerZone[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDangerZoneIdentifier(dangerZone: Pick<IDangerZone, 'id'>): number {
    return dangerZone.id;
  }

  compareDangerZone(o1: Pick<IDangerZone, 'id'> | null, o2: Pick<IDangerZone, 'id'> | null): boolean {
    return o1 && o2 ? this.getDangerZoneIdentifier(o1) === this.getDangerZoneIdentifier(o2) : o1 === o2;
  }

  addDangerZoneToCollectionIfMissing<Type extends Pick<IDangerZone, 'id'>>(
    dangerZoneCollection: Type[],
    ...dangerZonesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const dangerZones: Type[] = dangerZonesToCheck.filter(isPresent);
    if (dangerZones.length > 0) {
      const dangerZoneCollectionIdentifiers = dangerZoneCollection.map(dangerZoneItem => this.getDangerZoneIdentifier(dangerZoneItem)!);
      const dangerZonesToAdd = dangerZones.filter(dangerZoneItem => {
        const dangerZoneIdentifier = this.getDangerZoneIdentifier(dangerZoneItem);
        if (dangerZoneCollectionIdentifiers.includes(dangerZoneIdentifier)) {
          return false;
        }
        dangerZoneCollectionIdentifiers.push(dangerZoneIdentifier);
        return true;
      });
      return [...dangerZonesToAdd, ...dangerZoneCollection];
    }
    return dangerZoneCollection;
  }
}
