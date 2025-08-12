import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../danger-zone.test-samples';

import { DangerZoneFormService } from './danger-zone-form.service';

describe('DangerZone Form Service', () => {
  let service: DangerZoneFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DangerZoneFormService);
  });

  describe('Service methods', () => {
    describe('createDangerZoneFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDangerZoneFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            zoneName: expect.any(Object),
            zoneDescription: expect.any(Object),
            zoneLocation: expect.any(Object),
          })
        );
      });

      it('passing IDangerZone should create a new form with FormGroup', () => {
        const formGroup = service.createDangerZoneFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            zoneName: expect.any(Object),
            zoneDescription: expect.any(Object),
            zoneLocation: expect.any(Object),
          })
        );
      });
    });

    describe('getDangerZone', () => {
      it('should return NewDangerZone for default DangerZone initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDangerZoneFormGroup(sampleWithNewData);

        const dangerZone = service.getDangerZone(formGroup) as any;

        expect(dangerZone).toMatchObject(sampleWithNewData);
      });

      it('should return NewDangerZone for empty DangerZone initial value', () => {
        const formGroup = service.createDangerZoneFormGroup();

        const dangerZone = service.getDangerZone(formGroup) as any;

        expect(dangerZone).toMatchObject({});
      });

      it('should return IDangerZone', () => {
        const formGroup = service.createDangerZoneFormGroup(sampleWithRequiredData);

        const dangerZone = service.getDangerZone(formGroup) as any;

        expect(dangerZone).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDangerZone should not enable id FormControl', () => {
        const formGroup = service.createDangerZoneFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDangerZone should disable id FormControl', () => {
        const formGroup = service.createDangerZoneFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
