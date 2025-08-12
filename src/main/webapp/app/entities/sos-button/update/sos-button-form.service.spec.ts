import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../sos-button.test-samples';

import { SOSButtonFormService } from './sos-button-form.service';

describe('SOSButton Form Service', () => {
  let service: SOSButtonFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SOSButtonFormService);
  });

  describe('Service methods', () => {
    describe('createSOSButtonFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSOSButtonFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            label: expect.any(Object),
            isActivated: expect.any(Object),
            location: expect.any(Object),
            user: expect.any(Object),
            liveLocation: expect.any(Object),
          })
        );
      });

      it('passing ISOSButton should create a new form with FormGroup', () => {
        const formGroup = service.createSOSButtonFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            label: expect.any(Object),
            isActivated: expect.any(Object),
            location: expect.any(Object),
            user: expect.any(Object),
            liveLocation: expect.any(Object),
          })
        );
      });
    });

    describe('getSOSButton', () => {
      it('should return NewSOSButton for default SOSButton initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSOSButtonFormGroup(sampleWithNewData);

        const sOSButton = service.getSOSButton(formGroup) as any;

        expect(sOSButton).toMatchObject(sampleWithNewData);
      });

      it('should return NewSOSButton for empty SOSButton initial value', () => {
        const formGroup = service.createSOSButtonFormGroup();

        const sOSButton = service.getSOSButton(formGroup) as any;

        expect(sOSButton).toMatchObject({});
      });

      it('should return ISOSButton', () => {
        const formGroup = service.createSOSButtonFormGroup(sampleWithRequiredData);

        const sOSButton = service.getSOSButton(formGroup) as any;

        expect(sOSButton).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISOSButton should not enable id FormControl', () => {
        const formGroup = service.createSOSButtonFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSOSButton should disable id FormControl', () => {
        const formGroup = service.createSOSButtonFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
