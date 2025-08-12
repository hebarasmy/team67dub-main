import dayjs from 'dayjs/esm';

import { IUserChatHistory, NewUserChatHistory } from './user-chat-history.model';

export const sampleWithRequiredData: IUserChatHistory = {
  id: 43753,
};

export const sampleWithPartialData: IUserChatHistory = {
  id: 65880,
  senderUserID: 69370,
  messageContent: 'Wyoming artificial Borders',
};

export const sampleWithFullData: IUserChatHistory = {
  id: 50221,
  senderUserID: 37386,
  receiverUserID: 23036,
  messageContent: 'Secured',
  messageDateTime: dayjs('2024-03-26T08:17'),
};

export const sampleWithNewData: NewUserChatHistory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
