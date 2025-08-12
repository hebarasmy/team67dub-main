import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../voice-recording.test-samples';

import { VoiceRecordingFormService } from './voice-recording-form.service';

describe('VoiceRecording Form Service', () => {
  let service: VoiceRecordingFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceRecordingFormService);
  });

  describe('Service methods', () => {
    describe('createVoiceRecordingFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVoiceRecordingFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            duration: expect.any(Object),
            recordingDate: expect.any(Object),
            filePath: expect.any(Object),
            chatMessage: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IVoiceRecording should create a new form with FormGroup', () => {
        const formGroup = service.createVoiceRecordingFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            duration: expect.any(Object),
            recordingDate: expect.any(Object),
            filePath: expect.any(Object),
            chatMessage: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getVoiceRecording', () => {
      it('should return NewVoiceRecording for default VoiceRecording initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVoiceRecordingFormGroup(sampleWithNewData);

        const voiceRecording = service.getVoiceRecording(formGroup) as any;

        expect(voiceRecording).toMatchObject(sampleWithNewData);
      });

      it('should return NewVoiceRecording for empty VoiceRecording initial value', () => {
        const formGroup = service.createVoiceRecordingFormGroup();

        const voiceRecording = service.getVoiceRecording(formGroup) as any;

        expect(voiceRecording).toMatchObject({});
      });

      it('should return IVoiceRecording', () => {
        const formGroup = service.createVoiceRecordingFormGroup(sampleWithRequiredData);

        const voiceRecording = service.getVoiceRecording(formGroup) as any;

        expect(voiceRecording).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVoiceRecording should not enable id FormControl', () => {
        const formGroup = service.createVoiceRecordingFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVoiceRecording should disable id FormControl', () => {
        const formGroup = service.createVoiceRecordingFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
