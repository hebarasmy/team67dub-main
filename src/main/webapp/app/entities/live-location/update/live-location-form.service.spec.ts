import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../live-location.test-samples';

import { LiveLocationFormService } from './live-location-form.service';

describe('LiveLocation Form Service', () => {
  let service: LiveLocationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveLocationFormService);
  });

  describe('Service methods', () => {
    describe('createLiveLocationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLiveLocationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            currentLocation: expect.any(Object),
            currentLocationName: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing ILiveLocation should create a new form with FormGroup', () => {
        const formGroup = service.createLiveLocationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            currentLocation: expect.any(Object),
            currentLocationName: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getLiveLocation', () => {
      it('should return NewLiveLocation for default LiveLocation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLiveLocationFormGroup(sampleWithNewData);

        const liveLocation = service.getLiveLocation(formGroup) as any;

        expect(liveLocation).toMatchObject(sampleWithNewData);
      });

      it('should return NewLiveLocation for empty LiveLocation initial value', () => {
        const formGroup = service.createLiveLocationFormGroup();

        const liveLocation = service.getLiveLocation(formGroup) as any;

        expect(liveLocation).toMatchObject({});
      });

      it('should return ILiveLocation', () => {
        const formGroup = service.createLiveLocationFormGroup(sampleWithRequiredData);

        const liveLocation = service.getLiveLocation(formGroup) as any;

        expect(liveLocation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILiveLocation should not enable id FormControl', () => {
        const formGroup = service.createLiveLocationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLiveLocation should disable id FormControl', () => {
        const formGroup = service.createLiveLocationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
