import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChatMessageFormService } from './chat-message-form.service';
import { ChatMessageService } from '../service/chat-message.service';
import { IChatMessage } from '../chat-message.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ILiveLocation } from 'app/entities/live-location/live-location.model';
import { LiveLocationService } from 'app/entities/live-location/service/live-location.service';
import { IVoiceRecording } from 'app/entities/voice-recording/voice-recording.model';
import { VoiceRecordingService } from 'app/entities/voice-recording/service/voice-recording.service';
import { IContacts } from 'app/entities/contacts/contacts.model';
import { ContactsService } from 'app/entities/contacts/service/contacts.service';

import { ChatMessageUpdateComponent } from './chat-message-update.component';

describe('ChatMessage Management Update Component', () => {
  let comp: ChatMessageUpdateComponent;
  let fixture: ComponentFixture<ChatMessageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chatMessageFormService: ChatMessageFormService;
  let chatMessageService: ChatMessageService;
  let userService: UserService;
  let liveLocationService: LiveLocationService;
  let voiceRecordingService: VoiceRecordingService;
  let contactsService: ContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChatMessageUpdateComponent],
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
      .overrideTemplate(ChatMessageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChatMessageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chatMessageFormService = TestBed.inject(ChatMessageFormService);
    chatMessageService = TestBed.inject(ChatMessageService);
    userService = TestBed.inject(UserService);
    liveLocationService = TestBed.inject(LiveLocationService);
    voiceRecordingService = TestBed.inject(VoiceRecordingService);
    contactsService = TestBed.inject(ContactsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const chatMessage: IChatMessage = { id: 456 };
      const sender: IUser = { id: 55890 };
      chatMessage.sender = sender;
      const receiver: IUser = { id: 68126 };
      chatMessage.receiver = receiver;

      const userCollection: IUser[] = [{ id: 69626 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [sender, receiver];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chatMessage });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call LiveLocation query and add missing value', () => {
      const chatMessage: IChatMessage = { id: 456 };
      const liveLocation: ILiveLocation = { id: 3170 };
      chatMessage.liveLocation = liveLocation;

      const liveLocationCollection: ILiveLocation[] = [{ id: 56206 }];
      jest.spyOn(liveLocationService, 'query').mockReturnValue(of(new HttpResponse({ body: liveLocationCollection })));
      const additionalLiveLocations = [liveLocation];
      const expectedCollection: ILiveLocation[] = [...additionalLiveLocations, ...liveLocationCollection];
      jest.spyOn(liveLocationService, 'addLiveLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chatMessage });
      comp.ngOnInit();

      expect(liveLocationService.query).toHaveBeenCalled();
      expect(liveLocationService.addLiveLocationToCollectionIfMissing).toHaveBeenCalledWith(
        liveLocationCollection,
        ...additionalLiveLocations.map(expect.objectContaining)
      );
      expect(comp.liveLocationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call VoiceRecording query and add missing value', () => {
      const chatMessage: IChatMessage = { id: 456 };
      const voiceRecording: IVoiceRecording = { id: 89024 };
      chatMessage.voiceRecording = voiceRecording;

      const voiceRecordingCollection: IVoiceRecording[] = [{ id: 83861 }];
      jest.spyOn(voiceRecordingService, 'query').mockReturnValue(of(new HttpResponse({ body: voiceRecordingCollection })));
      const additionalVoiceRecordings = [voiceRecording];
      const expectedCollection: IVoiceRecording[] = [...additionalVoiceRecordings, ...voiceRecordingCollection];
      jest.spyOn(voiceRecordingService, 'addVoiceRecordingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chatMessage });
      comp.ngOnInit();

      expect(voiceRecordingService.query).toHaveBeenCalled();
      expect(voiceRecordingService.addVoiceRecordingToCollectionIfMissing).toHaveBeenCalledWith(
        voiceRecordingCollection,
        ...additionalVoiceRecordings.map(expect.objectContaining)
      );
      expect(comp.voiceRecordingsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Contacts query and add missing value', () => {
      const chatMessage: IChatMessage = { id: 456 };
      const contacts: IContacts = { id: 49795 };
      chatMessage.contacts = contacts;

      const contactsCollection: IContacts[] = [{ id: 94068 }];
      jest.spyOn(contactsService, 'query').mockReturnValue(of(new HttpResponse({ body: contactsCollection })));
      const additionalContacts = [contacts];
      const expectedCollection: IContacts[] = [...additionalContacts, ...contactsCollection];
      jest.spyOn(contactsService, 'addContactsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chatMessage });
      comp.ngOnInit();

      expect(contactsService.query).toHaveBeenCalled();
      expect(contactsService.addContactsToCollectionIfMissing).toHaveBeenCalledWith(
        contactsCollection,
        ...additionalContacts.map(expect.objectContaining)
      );
      expect(comp.contactsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const chatMessage: IChatMessage = { id: 456 };
      const sender: IUser = { id: 16476 };
      chatMessage.sender = sender;
      const receiver: IUser = { id: 11179 };
      chatMessage.receiver = receiver;
      const liveLocation: ILiveLocation = { id: 14609 };
      chatMessage.liveLocation = liveLocation;
      const voiceRecording: IVoiceRecording = { id: 38485 };
      chatMessage.voiceRecording = voiceRecording;
      const contacts: IContacts = { id: 20293 };
      chatMessage.contacts = contacts;

      activatedRoute.data = of({ chatMessage });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(sender);
      expect(comp.usersSharedCollection).toContain(receiver);
      expect(comp.liveLocationsSharedCollection).toContain(liveLocation);
      expect(comp.voiceRecordingsSharedCollection).toContain(voiceRecording);
      expect(comp.contactsSharedCollection).toContain(contacts);
      expect(comp.chatMessage).toEqual(chatMessage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChatMessage>>();
      const chatMessage = { id: 123 };
      jest.spyOn(chatMessageFormService, 'getChatMessage').mockReturnValue(chatMessage);
      jest.spyOn(chatMessageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chatMessage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chatMessage }));
      saveSubject.complete();

      // THEN
      expect(chatMessageFormService.getChatMessage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(chatMessageService.update).toHaveBeenCalledWith(expect.objectContaining(chatMessage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChatMessage>>();
      const chatMessage = { id: 123 };
      jest.spyOn(chatMessageFormService, 'getChatMessage').mockReturnValue({ id: null });
      jest.spyOn(chatMessageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chatMessage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chatMessage }));
      saveSubject.complete();

      // THEN
      expect(chatMessageFormService.getChatMessage).toHaveBeenCalled();
      expect(chatMessageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChatMessage>>();
      const chatMessage = { id: 123 };
      jest.spyOn(chatMessageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chatMessage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chatMessageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareLiveLocation', () => {
      it('Should forward to liveLocationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(liveLocationService, 'compareLiveLocation');
        comp.compareLiveLocation(entity, entity2);
        expect(liveLocationService.compareLiveLocation).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareVoiceRecording', () => {
      it('Should forward to voiceRecordingService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(voiceRecordingService, 'compareVoiceRecording');
        comp.compareVoiceRecording(entity, entity2);
        expect(voiceRecordingService.compareVoiceRecording).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareContacts', () => {
      it('Should forward to contactsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(contactsService, 'compareContacts');
        comp.compareContacts(entity, entity2);
        expect(contactsService.compareContacts).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
