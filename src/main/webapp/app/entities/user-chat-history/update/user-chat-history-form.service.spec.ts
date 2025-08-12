import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-chat-history.test-samples';

import { UserChatHistoryFormService } from './user-chat-history-form.service';

describe('UserChatHistory Form Service', () => {
  let service: UserChatHistoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserChatHistoryFormService);
  });

  describe('Service methods', () => {
    describe('createUserChatHistoryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserChatHistoryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            senderUserID: expect.any(Object),
            receiverUserID: expect.any(Object),
            messageContent: expect.any(Object),
            messageDateTime: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IUserChatHistory should create a new form with FormGroup', () => {
        const formGroup = service.createUserChatHistoryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            senderUserID: expect.any(Object),
            receiverUserID: expect.any(Object),
            messageContent: expect.any(Object),
            messageDateTime: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getUserChatHistory', () => {
      it('should return NewUserChatHistory for default UserChatHistory initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserChatHistoryFormGroup(sampleWithNewData);

        const userChatHistory = service.getUserChatHistory(formGroup) as any;

        expect(userChatHistory).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserChatHistory for empty UserChatHistory initial value', () => {
        const formGroup = service.createUserChatHistoryFormGroup();

        const userChatHistory = service.getUserChatHistory(formGroup) as any;

        expect(userChatHistory).toMatchObject({});
      });

      it('should return IUserChatHistory', () => {
        const formGroup = service.createUserChatHistoryFormGroup(sampleWithRequiredData);

        const userChatHistory = service.getUserChatHistory(formGroup) as any;

        expect(userChatHistory).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserChatHistory should not enable id FormControl', () => {
        const formGroup = service.createUserChatHistoryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserChatHistory should disable id FormControl', () => {
        const formGroup = service.createUserChatHistoryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
