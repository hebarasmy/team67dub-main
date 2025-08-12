import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IChatMessage, NewChatMessage } from '../chat-message.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IChatMessage for edit and NewChatMessageFormGroupInput for create.
 */
type ChatMessageFormGroupInput = IChatMessage | PartialWithRequiredKeyOf<NewChatMessage>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IChatMessage | NewChatMessage> = Omit<T, 'messageDateTime'> & {
  messageDateTime?: string | null;
};

type ChatMessageFormRawValue = FormValueOf<IChatMessage>;

type NewChatMessageFormRawValue = FormValueOf<NewChatMessage>;

type ChatMessageFormDefaults = Pick<NewChatMessage, 'id' | 'messageDateTime'>;

type ChatMessageFormGroupContent = {
  id: FormControl<ChatMessageFormRawValue['id'] | NewChatMessage['id']>;
  senderUserId: FormControl<ChatMessageFormRawValue['senderUserId']>;
  receiverUserId: FormControl<ChatMessageFormRawValue['receiverUserId']>;
  messageContent: FormControl<ChatMessageFormRawValue['messageContent']>;
  messageDateTime: FormControl<ChatMessageFormRawValue['messageDateTime']>;
  sender: FormControl<ChatMessageFormRawValue['sender']>;
  receiver: FormControl<ChatMessageFormRawValue['receiver']>;
  liveLocation: FormControl<ChatMessageFormRawValue['liveLocation']>;
  voiceRecording: FormControl<ChatMessageFormRawValue['voiceRecording']>;
  contacts: FormControl<ChatMessageFormRawValue['contacts']>;
};

export type ChatMessageFormGroup = FormGroup<ChatMessageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ChatMessageFormService {
  createChatMessageFormGroup(chatMessage: ChatMessageFormGroupInput = { id: null }): ChatMessageFormGroup {
    const chatMessageRawValue = this.convertChatMessageToChatMessageRawValue({
      ...this.getFormDefaults(),
      ...chatMessage,
    });
    return new FormGroup<ChatMessageFormGroupContent>({
      id: new FormControl(
        { value: chatMessageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      senderUserId: new FormControl(chatMessageRawValue.senderUserId),
      receiverUserId: new FormControl(chatMessageRawValue.receiverUserId),
      messageContent: new FormControl(chatMessageRawValue.messageContent),
      messageDateTime: new FormControl(chatMessageRawValue.messageDateTime),
      sender: new FormControl(chatMessageRawValue.sender),
      receiver: new FormControl(chatMessageRawValue.receiver),
      liveLocation: new FormControl(chatMessageRawValue.liveLocation),
      voiceRecording: new FormControl(chatMessageRawValue.voiceRecording),
      contacts: new FormControl(chatMessageRawValue.contacts),
    });
  }

  getChatMessage(form: ChatMessageFormGroup): IChatMessage | NewChatMessage {
    return this.convertChatMessageRawValueToChatMessage(form.getRawValue() as ChatMessageFormRawValue | NewChatMessageFormRawValue);
  }

  resetForm(form: ChatMessageFormGroup, chatMessage: ChatMessageFormGroupInput): void {
    const chatMessageRawValue = this.convertChatMessageToChatMessageRawValue({ ...this.getFormDefaults(), ...chatMessage });
    form.reset(
      {
        ...chatMessageRawValue,
        id: { value: chatMessageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ChatMessageFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      messageDateTime: currentTime,
    };
  }

  private convertChatMessageRawValueToChatMessage(
    rawChatMessage: ChatMessageFormRawValue | NewChatMessageFormRawValue
  ): IChatMessage | NewChatMessage {
    return {
      ...rawChatMessage,
      messageDateTime: dayjs(rawChatMessage.messageDateTime, DATE_TIME_FORMAT),
    };
  }

  private convertChatMessageToChatMessageRawValue(
    chatMessage: IChatMessage | (Partial<NewChatMessage> & ChatMessageFormDefaults)
  ): ChatMessageFormRawValue | PartialWithRequiredKeyOf<NewChatMessageFormRawValue> {
    return {
      ...chatMessage,
      messageDateTime: chatMessage.messageDateTime ? chatMessage.messageDateTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
