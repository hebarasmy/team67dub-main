import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserChatHistory } from '../user-chat-history.model';

@Component({
  selector: 'jhi-user-chat-history-detail',
  templateUrl: './user-chat-history-detail.component.html',
})
export class UserChatHistoryDetailComponent implements OnInit {
  userChatHistory: IUserChatHistory | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userChatHistory }) => {
      this.userChatHistory = userChatHistory;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
