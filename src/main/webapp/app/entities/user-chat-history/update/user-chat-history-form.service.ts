import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUserChatHistory, NewUserChatHistory } from '../user-chat-history.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserChatHistory for edit and NewUserChatHistoryFormGroupInput for create.
 */
type UserChatHistoryFormGroupInput = IUserChatHistory | PartialWithRequiredKeyOf<NewUserChatHistory>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IUserChatHistory | NewUserChatHistory> = Omit<T, 'messageDateTime'> & {
  messageDateTime?: string | null;
};

type UserChatHistoryFormRawValue = FormValueOf<IUserChatHistory>;

type NewUserChatHistoryFormRawValue = FormValueOf<NewUserChatHistory>;

type UserChatHistoryFormDefaults = Pick<NewUserChatHistory, 'id' | 'messageDateTime'>;

type UserChatHistoryFormGroupContent = {
  id: FormControl<UserChatHistoryFormRawValue['id'] | NewUserChatHistory['id']>;
  senderUserID: FormControl<UserChatHistoryFormRawValue['senderUserID']>;
  receiverUserID: FormControl<UserChatHistoryFormRawValue['receiverUserID']>;
  messageContent: FormControl<UserChatHistoryFormRawValue['messageContent']>;
  messageDateTime: FormControl<UserChatHistoryFormRawValue['messageDateTime']>;
  user: FormControl<UserChatHistoryFormRawValue['user']>;
};

export type UserChatHistoryFormGroup = FormGroup<UserChatHistoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserChatHistoryFormService {
  createUserChatHistoryFormGroup(userChatHistory: UserChatHistoryFormGroupInput = { id: null }): UserChatHistoryFormGroup {
    const userChatHistoryRawValue = this.convertUserChatHistoryToUserChatHistoryRawValue({
      ...this.getFormDefaults(),
      ...userChatHistory,
    });
    return new FormGroup<UserChatHistoryFormGroupContent>({
      id: new FormControl(
        { value: userChatHistoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      senderUserID: new FormControl(userChatHistoryRawValue.senderUserID),
      receiverUserID: new FormControl(userChatHistoryRawValue.receiverUserID),
      messageContent: new FormControl(userChatHistoryRawValue.messageContent),
      messageDateTime: new FormControl(userChatHistoryRawValue.messageDateTime),
      user: new FormControl(userChatHistoryRawValue.user),
    });
  }

  getUserChatHistory(form: UserChatHistoryFormGroup): IUserChatHistory | NewUserChatHistory {
    return this.convertUserChatHistoryRawValueToUserChatHistory(
      form.getRawValue() as UserChatHistoryFormRawValue | NewUserChatHistoryFormRawValue
    );
  }

  resetForm(form: UserChatHistoryFormGroup, userChatHistory: UserChatHistoryFormGroupInput): void {
    const userChatHistoryRawValue = this.convertUserChatHistoryToUserChatHistoryRawValue({ ...this.getFormDefaults(), ...userChatHistory });
    form.reset(
      {
        ...userChatHistoryRawValue,
        id: { value: userChatHistoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserChatHistoryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      messageDateTime: currentTime,
    };
  }

  private convertUserChatHistoryRawValueToUserChatHistory(
    rawUserChatHistory: UserChatHistoryFormRawValue | NewUserChatHistoryFormRawValue
  ): IUserChatHistory | NewUserChatHistory {
    return {
      ...rawUserChatHistory,
      messageDateTime: dayjs(rawUserChatHistory.messageDateTime, DATE_TIME_FORMAT),
    };
  }

  private convertUserChatHistoryToUserChatHistoryRawValue(
    userChatHistory: IUserChatHistory | (Partial<NewUserChatHistory> & UserChatHistoryFormDefaults)
  ): UserChatHistoryFormRawValue | PartialWithRequiredKeyOf<NewUserChatHistoryFormRawValue> {
    return {
      ...userChatHistory,
      messageDateTime: userChatHistory.messageDateTime ? userChatHistory.messageDateTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
