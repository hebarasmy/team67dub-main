import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserChatHistoryFormService, UserChatHistoryFormGroup } from './user-chat-history-form.service';
import { IUserChatHistory } from '../user-chat-history.model';
import { UserChatHistoryService } from '../service/user-chat-history.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-user-chat-history-update',
  templateUrl: './user-chat-history-update.component.html',
})
export class UserChatHistoryUpdateComponent implements OnInit {
  isSaving = false;
  userChatHistory: IUserChatHistory | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: UserChatHistoryFormGroup = this.userChatHistoryFormService.createUserChatHistoryFormGroup();

  constructor(
    protected userChatHistoryService: UserChatHistoryService,
    protected userChatHistoryFormService: UserChatHistoryFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userChatHistory }) => {
      this.userChatHistory = userChatHistory;
      if (userChatHistory) {
        this.updateForm(userChatHistory);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userChatHistory = this.userChatHistoryFormService.getUserChatHistory(this.editForm);
    if (userChatHistory.id !== null) {
      this.subscribeToSaveResponse(this.userChatHistoryService.update(userChatHistory));
    } else {
      this.subscribeToSaveResponse(this.userChatHistoryService.create(userChatHistory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserChatHistory>>): void {
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

  protected updateForm(userChatHistory: IUserChatHistory): void {
    this.userChatHistory = userChatHistory;
    this.userChatHistoryFormService.resetForm(this.editForm, userChatHistory);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, userChatHistory.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.userChatHistory?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
