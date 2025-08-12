import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILiveLocation, NewLiveLocation } from '../live-location.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILiveLocation for edit and NewLiveLocationFormGroupInput for create.
 */
type LiveLocationFormGroupInput = ILiveLocation | PartialWithRequiredKeyOf<NewLiveLocation>;

type LiveLocationFormDefaults = Pick<NewLiveLocation, 'id'>;

type LiveLocationFormGroupContent = {
  id: FormControl<ILiveLocation['id'] | NewLiveLocation['id']>;
  currentLocation: FormControl<ILiveLocation['currentLocation']>;
  currentLocationName: FormControl<ILiveLocation['currentLocationName']>;
  user: FormControl<ILiveLocation['user']>;
};

export type LiveLocationFormGroup = FormGroup<LiveLocationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LiveLocationFormService {
  createLiveLocationFormGroup(liveLocation: LiveLocationFormGroupInput = { id: null }): LiveLocationFormGroup {
    const liveLocationRawValue = {
      ...this.getFormDefaults(),
      ...liveLocation,
    };
    return new FormGroup<LiveLocationFormGroupContent>({
      id: new FormControl(
        { value: liveLocationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      currentLocation: new FormControl(liveLocationRawValue.currentLocation),
      currentLocationName: new FormControl(liveLocationRawValue.currentLocationName),
      user: new FormControl(liveLocationRawValue.user),
    });
  }

  getLiveLocation(form: LiveLocationFormGroup): ILiveLocation | NewLiveLocation {
    return form.getRawValue() as ILiveLocation | NewLiveLocation;
  }

  resetForm(form: LiveLocationFormGroup, liveLocation: LiveLocationFormGroupInput): void {
    const liveLocationRawValue = { ...this.getFormDefaults(), ...liveLocation };
    form.reset(
      {
        ...liveLocationRawValue,
        id: { value: liveLocationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LiveLocationFormDefaults {
    return {
      id: null,
    };
  }
}
