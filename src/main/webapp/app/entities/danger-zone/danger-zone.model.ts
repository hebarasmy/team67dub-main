import { Geopoint } from 'app/entities/enumerations/geopoint.model';

export interface IDangerZone {
  id: number;
  zoneName?: string | null;
  zoneDescription?: string | null;
  zoneLocation?: Geopoint | null;
}

export type NewDangerZone = Omit<IDangerZone, 'id'> & { id: null };
