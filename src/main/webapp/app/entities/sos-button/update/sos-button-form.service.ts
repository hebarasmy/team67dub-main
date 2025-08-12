import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISOSButton, NewSOSButton } from '../sos-button.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISOSButton for edit and NewSOSButtonFormGroupInput for create.
 */
type SOSButtonFormGroupInput = ISOSButton | PartialWithRequiredKeyOf<NewSOSButton>;

type SOSButtonFormDefaults = Pick<NewSOSButton, 'id' | 'isActivated'>;

type SOSButtonFormGroupContent = {
  id: FormControl<ISOSButton['id'] | NewSOSButton['id']>;
  label: FormControl<ISOSButton['label']>;
  isActivated: FormControl<ISOSButton['isActivated']>;
  location: FormControl<ISOSButton['location']>;
  user: FormControl<ISOSButton['user']>;
  liveLocation: FormControl<ISOSButton['liveLocation']>;
};

export type SOSButtonFormGroup = FormGroup<SOSButtonFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SOSButtonFormService {
  createSOSButtonFormGroup(sOSButton: SOSButtonFormGroupInput = { id: null }): SOSButtonFormGroup {
    const sOSButtonRawValue = {
      ...this.getFormDefaults(),
      ...sOSButton,
    };
    return new FormGroup<SOSButtonFormGroupContent>({
      id: new FormControl(
        { value: sOSButtonRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      label: new FormControl(sOSButtonRawValue.label),
      isActivated: new FormControl(sOSButtonRawValue.isActivated),
      location: new FormControl(sOSButtonRawValue.location),
      user: new FormControl(sOSButtonRawValue.user),
      liveLocation: new FormControl(sOSButtonRawValue.liveLocation),
    });
  }

  getSOSButton(form: SOSButtonFormGroup): ISOSButton | NewSOSButton {
    return form.getRawValue() as ISOSButton | NewSOSButton;
  }

  resetForm(form: SOSButtonFormGroup, sOSButton: SOSButtonFormGroupInput): void {
    const sOSButtonRawValue = { ...this.getFormDefaults(), ...sOSButton };
    form.reset(
      {
        ...sOSButtonRawValue,
        id: { value: sOSButtonRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SOSButtonFormDefaults {
    return {
      id: null,
      isActivated: false,
    };
  }
}
