import { IUser } from 'app/entities/user/user.model';
import { Geopoint } from 'app/entities/enumerations/geopoint.model';

export interface ILiveLocation {
  id: number;
  currentLocation?: Geopoint | null;
  currentLocationName?: string | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewLiveLocation = Omit<ILiveLocation, 'id'> & { id: null };
