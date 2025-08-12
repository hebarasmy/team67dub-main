import { Geopoint } from 'app/entities/enumerations/geopoint.model';

import { IPoliceStation, NewPoliceStation } from './police-station.model';

export const sampleWithRequiredData: IPoliceStation = {
  id: 16494,
};

export const sampleWithPartialData: IPoliceStation = {
  id: 56986,
  stationName: 'Bedfordshire',
  stationLocation: Geopoint['LATITUDE'],
};

export const sampleWithFullData: IPoliceStation = {
  id: 35776,
  stationName: 'deposit Horizontal',
  stationLocation: Geopoint['LONGITUDE'],
};

export const sampleWithNewData: NewPoliceStation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
