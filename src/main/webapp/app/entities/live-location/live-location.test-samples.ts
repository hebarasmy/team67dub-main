import { Geopoint } from 'app/entities/enumerations/geopoint.model';

import { ILiveLocation, NewLiveLocation } from './live-location.model';

export const sampleWithRequiredData: ILiveLocation = {
  id: 60861,
};

export const sampleWithPartialData: ILiveLocation = {
  id: 42008,
  currentLocation: Geopoint['LONGITUDE'],
};

export const sampleWithFullData: ILiveLocation = {
  id: 7734,
  currentLocation: Geopoint['LATITUDE'],
  currentLocationName: 'Triple-buffered',
};

export const sampleWithNewData: NewLiveLocation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
