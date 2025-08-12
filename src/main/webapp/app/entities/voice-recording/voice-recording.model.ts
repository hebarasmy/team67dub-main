import dayjs from 'dayjs/esm';
import { IChatMessage } from 'app/entities/chat-message/chat-message.model';
import { IUser } from 'app/entities/user/user.model';

export interface IVoiceRecording {
  id: number;
  title?: string | null;
  duration?: number | null;
  recordingDate?: dayjs.Dayjs | null;
  filePath?: string | null;
  chatMessage?: Pick<IChatMessage, 'id'> | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewVoiceRecording = Omit<IVoiceRecording, 'id'> & { id: null };
