import dayjs from 'dayjs/esm';

import { IChatMessage, NewChatMessage } from './chat-message.model';

export const sampleWithRequiredData: IChatMessage = {
  id: 16788,
};

export const sampleWithPartialData: IChatMessage = {
  id: 1607,
  receiverUserId: 67766,
  messageContent: 'architectures Investment e-business',
};

export const sampleWithFullData: IChatMessage = {
  id: 62312,
  senderUserId: 41688,
  receiverUserId: 81725,
  messageContent: 'Car flexibility rich',
  messageDateTime: dayjs('2024-03-26T02:50'),
};

export const sampleWithNewData: NewChatMessage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
