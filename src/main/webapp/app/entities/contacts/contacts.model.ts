import { IUser } from 'app/entities/user/user.model';
import { ISOSButton } from 'app/entities/sos-button/sos-button.model';
import { RelationshipType } from 'app/entities/enumerations/relationship-type.model';

export interface IContacts {
  id: number;
  image?: string | null;
  imageContentType?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  contactRelation?: RelationshipType | null;
  users?: Pick<IUser, 'id'>[] | null;
  sOSButton?: Pick<ISOSButton, 'id'> | null;
}

export type NewContacts = Omit<IContacts, 'id'> & { id: null };
