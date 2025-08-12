import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IContacts, NewContacts } from '../contacts.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IContacts for edit and NewContactsFormGroupInput for create.
 */
type ContactsFormGroupInput = IContacts | PartialWithRequiredKeyOf<NewContacts>;

type ContactsFormDefaults = Pick<NewContacts, 'id' | 'users'>;

type ContactsFormGroupContent = {
  id: FormControl<IContacts['id'] | NewContacts['id']>;
  image: FormControl<IContacts['image']>;
  imageContentType: FormControl<IContacts['imageContentType']>;
  contactName: FormControl<IContacts['contactName']>;
  contactPhone: FormControl<IContacts['contactPhone']>;
  contactRelation: FormControl<IContacts['contactRelation']>;
  users: FormControl<IContacts['users']>;
  sOSButton: FormControl<IContacts['sOSButton']>;
};

export type ContactsFormGroup = FormGroup<ContactsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ContactsFormService {
  createContactsFormGroup(contacts: ContactsFormGroupInput = { id: null }): ContactsFormGroup {
    const contactsRawValue = {
      ...this.getFormDefaults(),
      ...contacts,
    };
    return new FormGroup<ContactsFormGroupContent>({
      id: new FormControl(
        { value: contactsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      image: new FormControl(contactsRawValue.image),
      imageContentType: new FormControl(contactsRawValue.imageContentType),
      contactName: new FormControl(contactsRawValue.contactName),
      contactPhone: new FormControl(contactsRawValue.contactPhone),
      contactRelation: new FormControl(contactsRawValue.contactRelation),
      users: new FormControl(contactsRawValue.users ?? []),
      sOSButton: new FormControl(contactsRawValue.sOSButton),
    });
  }

  getContacts(form: ContactsFormGroup): IContacts | NewContacts {
    return form.getRawValue() as IContacts | NewContacts;
  }

  resetForm(form: ContactsFormGroup, contacts: ContactsFormGroupInput): void {
    const contactsRawValue = { ...this.getFormDefaults(), ...contacts };
    form.reset(
      {
        ...contactsRawValue,
        id: { value: contactsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ContactsFormDefaults {
    return {
      id: null,
      users: [],
    };
  }
}
