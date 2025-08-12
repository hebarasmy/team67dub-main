import dayjs from 'dayjs/esm';

import { IVoiceRecording, NewVoiceRecording } from './voice-recording.model';

export const sampleWithRequiredData: IVoiceRecording = {
  id: 11263,
};

export const sampleWithPartialData: IVoiceRecording = {
  id: 78062,
  title: 'Keys Synergized',
};

export const sampleWithFullData: IVoiceRecording = {
  id: 26344,
  title: 'quantify transmitting Hryvnia',
  duration: 67473,
  recordingDate: dayjs('2024-03-26T09:41'),
  filePath: 'knowledge',
};

export const sampleWithNewData: NewVoiceRecording = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
