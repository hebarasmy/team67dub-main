import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ContactListComponent } from 'app/components/contact-list/contact-list.component';
import { MessageListComponent } from 'app/components/message-list/message-list.component';
import { RouterModule } from '@angular/router';
import { CHAT_ROUTE } from './chat.route';
import { ContactsService } from 'app/entities/contacts/service/contacts.service';
import { PersonalChatComponent } from 'app/components/personal-chat/personal-chat.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ChatComponent, ContactListComponent, MessageListComponent, PersonalChatComponent],
  imports: [CommonModule, RouterModule.forChild([CHAT_ROUTE]), FormsModule],
  providers: [ContactsService],
})
export class ChatModule {
  constructor() {}
}
