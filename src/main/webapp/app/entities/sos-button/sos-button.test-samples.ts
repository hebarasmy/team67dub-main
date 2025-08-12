import { Geopoint } from 'app/entities/enumerations/geopoint.model';

import { ISOSButton, NewSOSButton } from './sos-button.model';

export const sampleWithRequiredData: ISOSButton = {
  id: 49376,
};

export const sampleWithPartialData: ISOSButton = {
  id: 87077,
  label: 'green RAM synergies',
};

export const sampleWithFullData: ISOSButton = {
  id: 9640,
  label: 'Senior',
  isActivated: false,
  location: Geopoint['LONGITUDE'],
};

export const sampleWithNewData: NewSOSButton = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
