import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserChatHistoryComponent } from './list/user-chat-history.component';
import { UserChatHistoryDetailComponent } from './detail/user-chat-history-detail.component';
import { UserChatHistoryUpdateComponent } from './update/user-chat-history-update.component';
import { UserChatHistoryDeleteDialogComponent } from './delete/user-chat-history-delete-dialog.component';
import { UserChatHistoryRoutingModule } from './route/user-chat-history-routing.module';

@NgModule({
  imports: [SharedModule, UserChatHistoryRoutingModule],
  declarations: [
    UserChatHistoryComponent,
    UserChatHistoryDetailComponent,
    UserChatHistoryUpdateComponent,
    UserChatHistoryDeleteDialogComponent,
  ],
})
export class UserChatHistoryModule {}
