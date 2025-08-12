import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { VoiceRecordingFormService, VoiceRecordingFormGroup } from './voice-recording-form.service';
import { IVoiceRecording } from '../voice-recording.model';
import { VoiceRecordingService } from '../service/voice-recording.service';
import { IChatMessage } from 'app/entities/chat-message/chat-message.model';
import { ChatMessageService } from 'app/entities/chat-message/service/chat-message.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-voice-recording-update',
  templateUrl: './voice-recording-update.component.html',
})
export class VoiceRecordingUpdateComponent implements OnInit {
  isSaving = false;
  voiceRecording: IVoiceRecording | null = null;

  chatMessagesSharedCollection: IChatMessage[] = [];
  usersSharedCollection: IUser[] = [];

  editForm: VoiceRecordingFormGroup = this.voiceRecordingFormService.createVoiceRecordingFormGroup();

  constructor(
    protected voiceRecordingService: VoiceRecordingService,
    protected voiceRecordingFormService: VoiceRecordingFormService,
    protected chatMessageService: ChatMessageService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareChatMessage = (o1: IChatMessage | null, o2: IChatMessage | null): boolean => this.chatMessageService.compareChatMessage(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ voiceRecording }) => {
      this.voiceRecording = voiceRecording;
      if (voiceRecording) {
        this.updateForm(voiceRecording);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const voiceRecording = this.voiceRecordingFormService.getVoiceRecording(this.editForm);
    if (voiceRecording.id !== null) {
      this.subscribeToSaveResponse(this.voiceRecordingService.update(voiceRecording));
    } else {
      this.subscribeToSaveResponse(this.voiceRecordingService.create(voiceRecording));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVoiceRecording>>): void {
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

  protected updateForm(voiceRecording: IVoiceRecording): void {
    this.voiceRecording = voiceRecording;
    this.voiceRecordingFormService.resetForm(this.editForm, voiceRecording);

    this.chatMessagesSharedCollection = this.chatMessageService.addChatMessageToCollectionIfMissing<IChatMessage>(
      this.chatMessagesSharedCollection,
      voiceRecording.chatMessage
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, voiceRecording.user);
  }

  protected loadRelationshipsOptions(): void {
    this.chatMessageService
      .query()
      .pipe(map((res: HttpResponse<IChatMessage[]>) => res.body ?? []))
      .pipe(
        map((chatMessages: IChatMessage[]) =>
          this.chatMessageService.addChatMessageToCollectionIfMissing<IChatMessage>(chatMessages, this.voiceRecording?.chatMessage)
        )
      )
      .subscribe((chatMessages: IChatMessage[]) => (this.chatMessagesSharedCollection = chatMessages));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.voiceRecording?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
