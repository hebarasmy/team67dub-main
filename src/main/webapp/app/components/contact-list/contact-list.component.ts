import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ContactsService } from '../../entities/contacts/service/contacts.service';
import { IContacts } from 'app/entities/contacts/contacts.model';

@Component({
  selector: 'jhi-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  constructor(private http: HttpClient, protected contactsService: ContactsService) {}

  contactList: IContacts[] = [];
  @Input() authToken: string = '';
  @Output() dataEvent = new EventEmitter<any>();

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

  handleContactClick(value: any) {
    const dataToSend = value;
    this.dataEvent.emit(dataToSend);
  }
}
