import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVoiceRecording, NewVoiceRecording } from '../voice-recording.model';

export type PartialUpdateVoiceRecording = Partial<IVoiceRecording> & Pick<IVoiceRecording, 'id'>;

type RestOf<T extends IVoiceRecording | NewVoiceRecording> = Omit<T, 'recordingDate'> & {
  recordingDate?: string | null;
};

export type RestVoiceRecording = RestOf<IVoiceRecording>;

export type NewRestVoiceRecording = RestOf<NewVoiceRecording>;

export type PartialUpdateRestVoiceRecording = RestOf<PartialUpdateVoiceRecording>;

export type EntityResponseType = HttpResponse<IVoiceRecording>;
export type EntityArrayResponseType = HttpResponse<IVoiceRecording[]>;

@Injectable({ providedIn: 'root' })
export class VoiceRecordingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/voice-recordings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(voiceRecording: NewVoiceRecording): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(voiceRecording);
    return this.http
      .post<RestVoiceRecording>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(voiceRecording: IVoiceRecording): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(voiceRecording);
    return this.http
      .put<RestVoiceRecording>(`${this.resourceUrl}/${this.getVoiceRecordingIdentifier(voiceRecording)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(voiceRecording: PartialUpdateVoiceRecording): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(voiceRecording);
    return this.http
      .patch<RestVoiceRecording>(`${this.resourceUrl}/${this.getVoiceRecordingIdentifier(voiceRecording)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVoiceRecording>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVoiceRecording[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVoiceRecordingIdentifier(voiceRecording: Pick<IVoiceRecording, 'id'>): number {
    return voiceRecording.id;
  }

  compareVoiceRecording(o1: Pick<IVoiceRecording, 'id'> | null, o2: Pick<IVoiceRecording, 'id'> | null): boolean {
    return o1 && o2 ? this.getVoiceRecordingIdentifier(o1) === this.getVoiceRecordingIdentifier(o2) : o1 === o2;
  }

  addVoiceRecordingToCollectionIfMissing<Type extends Pick<IVoiceRecording, 'id'>>(
    voiceRecordingCollection: Type[],
    ...voiceRecordingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const voiceRecordings: Type[] = voiceRecordingsToCheck.filter(isPresent);
    if (voiceRecordings.length > 0) {
      const voiceRecordingCollectionIdentifiers = voiceRecordingCollection.map(
        voiceRecordingItem => this.getVoiceRecordingIdentifier(voiceRecordingItem)!
      );
      const voiceRecordingsToAdd = voiceRecordings.filter(voiceRecordingItem => {
        const voiceRecordingIdentifier = this.getVoiceRecordingIdentifier(voiceRecordingItem);
        if (voiceRecordingCollectionIdentifiers.includes(voiceRecordingIdentifier)) {
          return false;
        }
        voiceRecordingCollectionIdentifiers.push(voiceRecordingIdentifier);
        return true;
      });
      return [...voiceRecordingsToAdd, ...voiceRecordingCollection];
    }
    return voiceRecordingCollection;
  }

  protected convertDateFromClient<T extends IVoiceRecording | NewVoiceRecording | PartialUpdateVoiceRecording>(
    voiceRecording: T
  ): RestOf<T> {
    return {
      ...voiceRecording,
      recordingDate: voiceRecording.recordingDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restVoiceRecording: RestVoiceRecording): IVoiceRecording {
    return {
      ...restVoiceRecording,
      recordingDate: restVoiceRecording.recordingDate ? dayjs(restVoiceRecording.recordingDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVoiceRecording>): HttpResponse<IVoiceRecording> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVoiceRecording[]>): HttpResponse<IVoiceRecording[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
