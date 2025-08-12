import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../police-station.test-samples';

import { PoliceStationFormService } from './police-station-form.service';

describe('PoliceStation Form Service', () => {
  let service: PoliceStationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoliceStationFormService);
  });

  describe('Service methods', () => {
    describe('createPoliceStationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPoliceStationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            stationName: expect.any(Object),
            stationLocation: expect.any(Object),
            liveLocation: expect.any(Object),
          })
        );
      });

      it('passing IPoliceStation should create a new form with FormGroup', () => {
        const formGroup = service.createPoliceStationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            stationName: expect.any(Object),
            stationLocation: expect.any(Object),
            liveLocation: expect.any(Object),
          })
        );
      });
    });

    describe('getPoliceStation', () => {
      it('should return NewPoliceStation for default PoliceStation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPoliceStationFormGroup(sampleWithNewData);

        const policeStation = service.getPoliceStation(formGroup) as any;

        expect(policeStation).toMatchObject(sampleWithNewData);
      });

      it('should return NewPoliceStation for empty PoliceStation initial value', () => {
        const formGroup = service.createPoliceStationFormGroup();

        const policeStation = service.getPoliceStation(formGroup) as any;

        expect(policeStation).toMatchObject({});
      });

      it('should return IPoliceStation', () => {
        const formGroup = service.createPoliceStationFormGroup(sampleWithRequiredData);

        const policeStation = service.getPoliceStation(formGroup) as any;

        expect(policeStation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPoliceStation should not enable id FormControl', () => {
        const formGroup = service.createPoliceStationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPoliceStation should disable id FormControl', () => {
        const formGroup = service.createPoliceStationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
