import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IContacts } from 'app/entities/contacts/contacts.model';

@Component({
  selector: 'jhi-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit {
  selectedId = '';
  profileImg: string =
    'data:image/jpeg;base64,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';
  contactList: any[] = [];
  @Input() authToken: string = '';
  @Output() dataEvent = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getContactList();
  }

  getContactList() {
    this.fetchData().subscribe(data => {
      this.contactList = data;
    });
  }

  fetchData() {
    const token = this.authToken;
    const apiUrl = 'http://localhost:8080/api/contacts';

    // Headers including the bearer token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    // Making HTTP GET request with headers
    return this.http.get<any>(apiUrl, { headers: headers });
  }
  messagesList: any = [
    { id: '1', name: 'Ali', message: 'Hi, How are you?' },
    { id: '2', name: 'Rameese', message: 'I have an emergency' },
    { id: '3', name: 'Kate', message: 'Can you reach here fast' },
    { id: '4', name: 'Kate', message: 'Can you reach here fast' },
    { id: '5', name: 'Kate', message: 'Can you reach here fast' },
  ];

  handleMessageClick(value: any) {
    const dataToSend = value;
    this.dataEvent.emit(dataToSend);
  }
}
