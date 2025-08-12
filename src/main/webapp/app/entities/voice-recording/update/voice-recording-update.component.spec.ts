import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VoiceRecordingFormService } from './voice-recording-form.service';
import { VoiceRecordingService } from '../service/voice-recording.service';
import { IVoiceRecording } from '../voice-recording.model';
import { IChatMessage } from 'app/entities/chat-message/chat-message.model';
import { ChatMessageService } from 'app/entities/chat-message/service/chat-message.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { VoiceRecordingUpdateComponent } from './voice-recording-update.component';

describe('VoiceRecording Management Update Component', () => {
  let comp: VoiceRecordingUpdateComponent;
  let fixture: ComponentFixture<VoiceRecordingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let voiceRecordingFormService: VoiceRecordingFormService;
  let voiceRecordingService: VoiceRecordingService;
  let chatMessageService: ChatMessageService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VoiceRecordingUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(VoiceRecordingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VoiceRecordingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    voiceRecordingFormService = TestBed.inject(VoiceRecordingFormService);
    voiceRecordingService = TestBed.inject(VoiceRecordingService);
    chatMessageService = TestBed.inject(ChatMessageService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ChatMessage query and add missing value', () => {
      const voiceRecording: IVoiceRecording = { id: 456 };
      const chatMessage: IChatMessage = { id: 34106 };
      voiceRecording.chatMessage = chatMessage;

      const chatMessageCollection: IChatMessage[] = [{ id: 25643 }];
      jest.spyOn(chatMessageService, 'query').mockReturnValue(of(new HttpResponse({ body: chatMessageCollection })));
      const additionalChatMessages = [chatMessage];
      const expectedCollection: IChatMessage[] = [...additionalChatMessages, ...chatMessageCollection];
      jest.spyOn(chatMessageService, 'addChatMessageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ voiceRecording });
      comp.ngOnInit();

      expect(chatMessageService.query).toHaveBeenCalled();
      expect(chatMessageService.addChatMessageToCollectionIfMissing).toHaveBeenCalledWith(
        chatMessageCollection,
        ...additionalChatMessages.map(expect.objectContaining)
      );
      expect(comp.chatMessagesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const voiceRecording: IVoiceRecording = { id: 456 };
      const user: IUser = { id: 34223 };
      voiceRecording.user = user;

      const userCollection: IUser[] = [{ id: 84126 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ voiceRecording });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const voiceRecording: IVoiceRecording = { id: 456 };
      const chatMessage: IChatMessage = { id: 62319 };
      voiceRecording.chatMessage = chatMessage;
      const user: IUser = { id: 88579 };
      voiceRecording.user = user;

      activatedRoute.data = of({ voiceRecording });
      comp.ngOnInit();

      expect(comp.chatMessagesSharedCollection).toContain(chatMessage);
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.voiceRecording).toEqual(voiceRecording);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoiceRecording>>();
      const voiceRecording = { id: 123 };
      jest.spyOn(voiceRecordingFormService, 'getVoiceRecording').mockReturnValue(voiceRecording);
      jest.spyOn(voiceRecordingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voiceRecording });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: voiceRecording }));
      saveSubject.complete();

      // THEN
      expect(voiceRecordingFormService.getVoiceRecording).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(voiceRecordingService.update).toHaveBeenCalledWith(expect.objectContaining(voiceRecording));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoiceRecording>>();
      const voiceRecording = { id: 123 };
      jest.spyOn(voiceRecordingFormService, 'getVoiceRecording').mockReturnValue({ id: null });
      jest.spyOn(voiceRecordingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voiceRecording: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: voiceRecording }));
      saveSubject.complete();

      // THEN
      expect(voiceRecordingFormService.getVoiceRecording).toHaveBeenCalled();
      expect(voiceRecordingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoiceRecording>>();
      const voiceRecording = { id: 123 };
      jest.spyOn(voiceRecordingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voiceRecording });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(voiceRecordingService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareChatMessage', () => {
      it('Should forward to chatMessageService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(chatMessageService, 'compareChatMessage');
        comp.compareChatMessage(entity, entity2);
        expect(chatMessageService.compareChatMessage).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
