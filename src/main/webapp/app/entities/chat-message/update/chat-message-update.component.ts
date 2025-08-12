import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ChatMessageFormService, ChatMessageFormGroup } from './chat-message-form.service';
import { IChatMessage } from '../chat-message.model';
import { ChatMessageService } from '../service/chat-message.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ILiveLocation } from 'app/entities/live-location/live-location.model';
import { LiveLocationService } from 'app/entities/live-location/service/live-location.service';
import { IVoiceRecording } from 'app/entities/voice-recording/voice-recording.model';
import { VoiceRecordingService } from 'app/entities/voice-recording/service/voice-recording.service';
import { IContacts } from 'app/entities/contacts/contacts.model';
import { ContactsService } from 'app/entities/contacts/service/contacts.service';

@Component({
  selector: 'jhi-chat-message-update',
  templateUrl: './chat-message-update.component.html',
})
export class ChatMessageUpdateComponent implements OnInit {
  isSaving = false;
  chatMessage: IChatMessage | null = null;

  usersSharedCollection: IUser[] = [];
  liveLocationsSharedCollection: ILiveLocation[] = [];
  voiceRecordingsSharedCollection: IVoiceRecording[] = [];
  contactsSharedCollection: IContacts[] = [];

  editForm: ChatMessageFormGroup = this.chatMessageFormService.createChatMessageFormGroup();

  constructor(
    protected chatMessageService: ChatMessageService,
    protected chatMessageFormService: ChatMessageFormService,
    protected userService: UserService,
    protected liveLocationService: LiveLocationService,
    protected voiceRecordingService: VoiceRecordingService,
    protected contactsService: ContactsService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareLiveLocation = (o1: ILiveLocation | null, o2: ILiveLocation | null): boolean =>
    this.liveLocationService.compareLiveLocation(o1, o2);

  compareVoiceRecording = (o1: IVoiceRecording | null, o2: IVoiceRecording | null): boolean =>
    this.voiceRecordingService.compareVoiceRecording(o1, o2);

  compareContacts = (o1: IContacts | null, o2: IContacts | null): boolean => this.contactsService.compareContacts(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chatMessage }) => {
      this.chatMessage = chatMessage;
      if (chatMessage) {
        this.updateForm(chatMessage);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chatMessage = this.chatMessageFormService.getChatMessage(this.editForm);
    if (chatMessage.id !== null) {
      this.subscribeToSaveResponse(this.chatMessageService.update(chatMessage));
    } else {
      this.subscribeToSaveResponse(this.chatMessageService.create(chatMessage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChatMessage>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(chatMessage: IChatMessage): void {
    this.chatMessage = chatMessage;
    this.chatMessageFormService.resetForm(this.editForm, chatMessage);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(
      this.usersSharedCollection,
      chatMessage.sender,
      chatMessage.receiver
    );
    this.liveLocationsSharedCollection = this.liveLocationService.addLiveLocationToCollectionIfMissing<ILiveLocation>(
      this.liveLocationsSharedCollection,
      chatMessage.liveLocation
    );
    this.voiceRecordingsSharedCollection = this.voiceRecordingService.addVoiceRecordingToCollectionIfMissing<IVoiceRecording>(
      this.voiceRecordingsSharedCollection,
      chatMessage.voiceRecording
    );
    this.contactsSharedCollection = this.contactsService.addContactsToCollectionIfMissing<IContacts>(
      this.contactsSharedCollection,
      chatMessage.contacts
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(
        map((users: IUser[]) =>
          this.userService.addUserToCollectionIfMissing<IUser>(users, this.chatMessage?.sender, this.chatMessage?.receiver)
        )
      )
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.liveLocationService
      .query()
      .pipe(map((res: HttpResponse<ILiveLocation[]>) => res.body ?? []))
      .pipe(
        map((liveLocations: ILiveLocation[]) =>
          this.liveLocationService.addLiveLocationToCollectionIfMissing<ILiveLocation>(liveLocations, this.chatMessage?.liveLocation)
        )
      )
      .subscribe((liveLocations: ILiveLocation[]) => (this.liveLocationsSharedCollection = liveLocations));

    this.voiceRecordingService
      .query()
      .pipe(map((res: HttpResponse<IVoiceRecording[]>) => res.body ?? []))
      .pipe(
        map((voiceRecordings: IVoiceRecording[]) =>
          this.voiceRecordingService.addVoiceRecordingToCollectionIfMissing<IVoiceRecording>(
            voiceRecordings,
            this.chatMessage?.voiceRecording
          )
        )
      )
      .subscribe((voiceRecordings: IVoiceRecording[]) => (this.voiceRecordingsSharedCollection = voiceRecordings));

    this.contactsService
      .query()
      .pipe(map((res: HttpResponse<IContacts[]>) => res.body ?? []))
      .pipe(
        map((contacts: IContacts[]) =>
          this.contactsService.addContactsToCollectionIfMissing<IContacts>(contacts, this.chatMessage?.contacts)
        )
      )
      .subscribe((contacts: IContacts[]) => (this.contactsSharedCollection = contacts));
  }
}
