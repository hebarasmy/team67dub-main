import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IUserChatHistory {
  id: number;
  senderUserID?: number | null;
  receiverUserID?: number | null;
  messageContent?: string | null;
  messageDateTime?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewUserChatHistory = Omit<IUserChatHistory, 'id'> & { id: null };
