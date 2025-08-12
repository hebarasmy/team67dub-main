import { RelationshipType } from 'app/entities/enumerations/relationship-type.model';

import { IContacts, NewContacts } from './contacts.model';

export const sampleWithRequiredData: IContacts = {
  id: 22084,
};

export const sampleWithPartialData: IContacts = {
  id: 45151,
  contactName: 'TCP Ergonomic National',
  contactPhone: 'Dynamic',
};

export const sampleWithFullData: IContacts = {
  id: 69140,
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  contactName: 'services Generic Buckinghamshire',
  contactPhone: 'visionary',
  contactRelation: RelationshipType['COLLEAGUE'],
};

export const sampleWithNewData: NewContacts = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
