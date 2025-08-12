import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVoiceRecording, NewVoiceRecording } from '../voice-recording.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVoiceRecording for edit and NewVoiceRecordingFormGroupInput for create.
 */
type VoiceRecordingFormGroupInput = IVoiceRecording | PartialWithRequiredKeyOf<NewVoiceRecording>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IVoiceRecording | NewVoiceRecording> = Omit<T, 'recordingDate'> & {
  recordingDate?: string | null;
};

type VoiceRecordingFormRawValue = FormValueOf<IVoiceRecording>;

type NewVoiceRecordingFormRawValue = FormValueOf<NewVoiceRecording>;

type VoiceRecordingFormDefaults = Pick<NewVoiceRecording, 'id' | 'recordingDate'>;

type VoiceRecordingFormGroupContent = {
  id: FormControl<VoiceRecordingFormRawValue['id'] | NewVoiceRecording['id']>;
  title: FormControl<VoiceRecordingFormRawValue['title']>;
  duration: FormControl<VoiceRecordingFormRawValue['duration']>;
  recordingDate: FormControl<VoiceRecordingFormRawValue['recordingDate']>;
  filePath: FormControl<VoiceRecordingFormRawValue['filePath']>;
  chatMessage: FormControl<VoiceRecordingFormRawValue['chatMessage']>;
  user: FormControl<VoiceRecordingFormRawValue['user']>;
};

export type VoiceRecordingFormGroup = FormGroup<VoiceRecordingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VoiceRecordingFormService {
  createVoiceRecordingFormGroup(voiceRecording: VoiceRecordingFormGroupInput = { id: null }): VoiceRecordingFormGroup {
    const voiceRecordingRawValue = this.convertVoiceRecordingToVoiceRecordingRawValue({
      ...this.getFormDefaults(),
      ...voiceRecording,
    });
    return new FormGroup<VoiceRecordingFormGroupContent>({
      id: new FormControl(
        { value: voiceRecordingRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(voiceRecordingRawValue.title),
      duration: new FormControl(voiceRecordingRawValue.duration),
      recordingDate: new FormControl(voiceRecordingRawValue.recordingDate),
      filePath: new FormControl(voiceRecordingRawValue.filePath),
      chatMessage: new FormControl(voiceRecordingRawValue.chatMessage),
      user: new FormControl(voiceRecordingRawValue.user),
    });
  }

  getVoiceRecording(form: VoiceRecordingFormGroup): IVoiceRecording | NewVoiceRecording {
    return this.convertVoiceRecordingRawValueToVoiceRecording(
      form.getRawValue() as VoiceRecordingFormRawValue | NewVoiceRecordingFormRawValue
    );
  }

  resetForm(form: VoiceRecordingFormGroup, voiceRecording: VoiceRecordingFormGroupInput): void {
    const voiceRecordingRawValue = this.convertVoiceRecordingToVoiceRecordingRawValue({ ...this.getFormDefaults(), ...voiceRecording });
    form.reset(
      {
        ...voiceRecordingRawValue,
        id: { value: voiceRecordingRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VoiceRecordingFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      recordingDate: currentTime,
    };
  }

  private convertVoiceRecordingRawValueToVoiceRecording(
    rawVoiceRecording: VoiceRecordingFormRawValue | NewVoiceRecordingFormRawValue
  ): IVoiceRecording | NewVoiceRecording {
    return {
      ...rawVoiceRecording,
      recordingDate: dayjs(rawVoiceRecording.recordingDate, DATE_TIME_FORMAT),
    };
  }

  private convertVoiceRecordingToVoiceRecordingRawValue(
    voiceRecording: IVoiceRecording | (Partial<NewVoiceRecording> & VoiceRecordingFormDefaults)
  ): VoiceRecordingFormRawValue | PartialWithRequiredKeyOf<NewVoiceRecordingFormRawValue> {
    return {
      ...voiceRecording,
      recordingDate: voiceRecording.recordingDate ? voiceRecording.recordingDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
