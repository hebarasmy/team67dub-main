import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDangerZone, NewDangerZone } from '../danger-zone.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDangerZone for edit and NewDangerZoneFormGroupInput for create.
 */
type DangerZoneFormGroupInput = IDangerZone | PartialWithRequiredKeyOf<NewDangerZone>;

type DangerZoneFormDefaults = Pick<NewDangerZone, 'id'>;

type DangerZoneFormGroupContent = {
  id: FormControl<IDangerZone['id'] | NewDangerZone['id']>;
  zoneName: FormControl<IDangerZone['zoneName']>;
  zoneDescription: FormControl<IDangerZone['zoneDescription']>;
  zoneLocation: FormControl<IDangerZone['zoneLocation']>;
};

export type DangerZoneFormGroup = FormGroup<DangerZoneFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DangerZoneFormService {
  createDangerZoneFormGroup(dangerZone: DangerZoneFormGroupInput = { id: null }): DangerZoneFormGroup {
    const dangerZoneRawValue = {
      ...this.getFormDefaults(),
      ...dangerZone,
    };
    return new FormGroup<DangerZoneFormGroupContent>({
      id: new FormControl(
        { value: dangerZoneRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      zoneName: new FormControl(dangerZoneRawValue.zoneName),
      zoneDescription: new FormControl(dangerZoneRawValue.zoneDescription),
      zoneLocation: new FormControl(dangerZoneRawValue.zoneLocation),
    });
  }

  getDangerZone(form: DangerZoneFormGroup): IDangerZone | NewDangerZone {
    return form.getRawValue() as IDangerZone | NewDangerZone;
  }

  resetForm(form: DangerZoneFormGroup, dangerZone: DangerZoneFormGroupInput): void {
    const dangerZoneRawValue = { ...this.getFormDefaults(), ...dangerZone };
    form.reset(
      {
        ...dangerZoneRawValue,
        id: { value: dangerZoneRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DangerZoneFormDefaults {
    return {
      id: null,
    };
  }
}
