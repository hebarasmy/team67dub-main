import { Geopoint } from 'app/entities/enumerations/geopoint.model';

import { IHospital, NewHospital } from './hospital.model';

export const sampleWithRequiredData: IHospital = {
  id: 63080,
};

export const sampleWithPartialData: IHospital = {
  id: 37115,
};

export const sampleWithFullData: IHospital = {
  id: 95249,
  hospitalName: 'Islands payment',
  hospitalLocation: Geopoint['LATITUDE'],
};

export const sampleWithNewData: NewHospital = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
