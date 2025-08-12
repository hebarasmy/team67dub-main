import { ILiveLocation } from 'app/entities/live-location/live-location.model';
import { Geopoint } from 'app/entities/enumerations/geopoint.model';

export interface IHospital {
  id: number;
  hospitalName?: string | null;
  hospitalLocation?: Geopoint | null;
  liveLocation?: Pick<ILiveLocation, 'id'> | null;
}

export type NewHospital = Omit<IHospital, 'id'> & { id: null };
