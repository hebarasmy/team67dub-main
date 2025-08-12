/* eslint-disable*/
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { ChatService } from '../components/personal-chat/chat.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @Input() selectedItem: any;
  account: Account | null = null;
  showModal: boolean = false; // Controls modal visibility

  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router, private chatService: ChatService, private http: HttpClient) {}

  ngOnInit(): void {
    // Subscribe to authentication state on component initialization
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  toggleModal(): void {
    // Toggle the visibility of the modal
    this.showModal = !this.showModal;
  }

  async handleSOSResponse(isInDanger: boolean): Promise<void> {
    // Always hide the modal after a response
    this.showModal = false;
    if (isInDanger) {
      // Get the auth token, receiver ID, and message content

      const receiverId = 1151; // Determine how you will get the receiver's ID
      const message = 'I am in danger, please help';

      (await this.chatService.sendMessageToAllContacts(message)).subscribe({
        next: (results: any) => {
          console.log('Messages sent successfully', results);
        },
        error: (error: any) => {
          console.error('Error sending SOS message:', error);
        },
      });

      this.showModal = false;
    } else {
      console.log('User is not in danger.');
      // Optional: Implement any actions for when user clicks 'No'
    }
  }
  handleChatClick(): void {
    this.router.navigateByUrl('/chat');
  }

  ngOnDestroy(): void {
    // Clean up the subscription
    this.destroy$.next();
    this.destroy$.complete();
  }
  login(): void {
    this.router.navigate(['/login']);
  }

}
