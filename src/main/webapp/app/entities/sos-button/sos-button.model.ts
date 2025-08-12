import { IUser } from 'app/entities/user/user.model';
import { ILiveLocation } from 'app/entities/live-location/live-location.model';
import { Geopoint } from 'app/entities/enumerations/geopoint.model';

export interface ISOSButton {
  id: number;
  label?: string | null;
  isActivated?: boolean | null;
  location?: Geopoint | null;
  user?: Pick<IUser, 'id'> | null;
  liveLocation?: Pick<ILiveLocation, 'id'> | null;
}

export type NewSOSButton = Omit<ISOSButton, 'id'> & { id: null };
