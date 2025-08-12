import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPoliceStation, NewPoliceStation } from '../police-station.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPoliceStation for edit and NewPoliceStationFormGroupInput for create.
 */
type PoliceStationFormGroupInput = IPoliceStation | PartialWithRequiredKeyOf<NewPoliceStation>;

type PoliceStationFormDefaults = Pick<NewPoliceStation, 'id'>;

type PoliceStationFormGroupContent = {
  id: FormControl<IPoliceStation['id'] | NewPoliceStation['id']>;
  stationName: FormControl<IPoliceStation['stationName']>;
  stationLocation: FormControl<IPoliceStation['stationLocation']>;
  liveLocation: FormControl<IPoliceStation['liveLocation']>;
};

export type PoliceStationFormGroup = FormGroup<PoliceStationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PoliceStationFormService {
  createPoliceStationFormGroup(policeStation: PoliceStationFormGroupInput = { id: null }): PoliceStationFormGroup {
    const policeStationRawValue = {
      ...this.getFormDefaults(),
      ...policeStation,
    };
    return new FormGroup<PoliceStationFormGroupContent>({
      id: new FormControl(
        { value: policeStationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      stationName: new FormControl(policeStationRawValue.stationName),
      stationLocation: new FormControl(policeStationRawValue.stationLocation),
      liveLocation: new FormControl(policeStationRawValue.liveLocation),
    });
  }

  getPoliceStation(form: PoliceStationFormGroup): IPoliceStation | NewPoliceStation {
    return form.getRawValue() as IPoliceStation | NewPoliceStation;
  }

  resetForm(form: PoliceStationFormGroup, policeStation: PoliceStationFormGroupInput): void {
    const policeStationRawValue = { ...this.getFormDefaults(), ...policeStation };
    form.reset(
      {
        ...policeStationRawValue,
        id: { value: policeStationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PoliceStationFormDefaults {
    return {
      id: null,
    };
  }
}
