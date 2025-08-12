import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserChatHistory } from '../user-chat-history.model';
import { UserChatHistoryService } from '../service/user-chat-history.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './user-chat-history-delete-dialog.component.html',
})
export class UserChatHistoryDeleteDialogComponent {
  userChatHistory?: IUserChatHistory;

  constructor(protected userChatHistoryService: UserChatHistoryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userChatHistoryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
