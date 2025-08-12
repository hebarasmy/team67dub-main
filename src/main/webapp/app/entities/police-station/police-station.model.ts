import { ILiveLocation } from 'app/entities/live-location/live-location.model';
import { Geopoint } from 'app/entities/enumerations/geopoint.model';

export interface IPoliceStation {
  id: number;
  stationName?: string | null;
  stationLocation?: Geopoint | null;
  liveLocation?: Pick<ILiveLocation, 'id'> | null;
}

export type NewPoliceStation = Omit<IPoliceStation, 'id'> & { id: null };
