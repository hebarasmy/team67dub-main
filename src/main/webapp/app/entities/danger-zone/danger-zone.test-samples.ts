import { Geopoint } from 'app/entities/enumerations/geopoint.model';

import { IDangerZone, NewDangerZone } from './danger-zone.model';

export const sampleWithRequiredData: IDangerZone = {
  id: 7808,
};

export const sampleWithPartialData: IDangerZone = {
  id: 97396,
  zoneName: 'Republic Salad THX',
  zoneLocation: Geopoint['LATITUDE'],
};

export const sampleWithFullData: IDangerZone = {
  id: 32981,
  zoneName: 'Refined invoice',
  zoneDescription: 'Dollar Architect',
  zoneLocation: Geopoint['LONGITUDE'],
};

export const sampleWithNewData: NewDangerZone = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
