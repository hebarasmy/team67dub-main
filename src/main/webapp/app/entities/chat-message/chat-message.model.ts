import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { ILiveLocation } from 'app/entities/live-location/live-location.model';
import { IVoiceRecording } from 'app/entities/voice-recording/voice-recording.model';
import { IContacts } from 'app/entities/contacts/contacts.model';

export interface IChatMessage {
  id: number;
  senderUserId?: number | null;
  receiverUserId?: number | null;
  messageContent?: string | null;
  messageDateTime?: dayjs.Dayjs | null;
  sender?: Pick<IUser, 'id'> | null;
  receiver?: Pick<IUser, 'id'> | null;
  liveLocation?: Pick<ILiveLocation, 'id'> | null;
  voiceRecording?: Pick<IVoiceRecording, 'id'> | null;
  contacts?: Pick<IContacts, 'id'> | null;
}

export type NewChatMessage = Omit<IChatMessage, 'id'> & { id: null };
