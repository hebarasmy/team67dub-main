/* eslint-disable*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, from, throwError } from 'rxjs';
import { catchError, mergeMap, toArray } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
export interface Contact {
  id: number;
  // Add other properties as needed
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly sendMessageApiUrl = 'http://localhost:8080/api/user-chat-histories';
  private readonly contactsUrl = 'http://localhost:8080/api/contacts';
  constructor(private http: HttpClient) {}

  // Function to send a message
  sendMessage(message: string, receiverId: number): Observable<any> {
    const authToken = this.getAuthToken(); // Implement this method to get the token
    if (!authToken) {
      // Handle the case where there is no auth token
      return throwError('No auth token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });

    const payload = {
      senderUserID: 1051, // This should be dynamic based on the logged-in user
      receiverUserID: receiverId,
      messageContent: message,
    };

    const contacts = this.getContactList().subscribe(data => {
      console.log('🚀 ~ ChatService ~ contacts ~ data:', data);
      return data;
    });

    console.log('🚀 ~ ChatService ~ sendMessage ~ contacts:', contacts);

    return this.http.post<any>(this.sendMessageApiUrl, payload, { headers }).pipe(catchError(this.handleError));
  }

  getContactList(): Observable<any> {
    const authToken = this.getAuthToken();
    if (!authToken) {
      return throwError('No auth token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });

    return this.http.get<any>(this.contactsUrl, { headers: headers });
  }

  getLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            console.log('Latitude:', position.coords.latitude, 'Longitude:', position.coords.longitude);
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error: GeolocationPositionError) => {
            console.error(error);
            reject(error);
          }
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

  async sendMessageToAllContacts(message: string): Promise<Observable<any[]>> {
    const currentLocation = await this.getLocation();
    console.log('🚀 ~ ChatService ~ sendMessageToAllContacts ~ currentLocation:', currentLocation);

    const authToken = this.getAuthToken();
    if (!authToken) {
      return throwError(() => new Error('No auth token found'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });

    return this.getContactList().pipe(
      mergeMap(contacts => from(contacts)), // Convert the array of contacts to an Observable stream
      mergeMap((contact: any) => {
        const payload = {
          senderUserID: 1051, // Replace with dynamic sender ID
          receiverUserID: contact.id,
          messageContent: `${message} my current location is (latitude: ${currentLocation.lat}, longitude: ${currentLocation.lng}`,
        };
        return this.http.post<any>(this.sendMessageApiUrl, payload, { headers });
      }),
      toArray(), // Aggregate all responses into a single array
      catchError(this.handleError)
    );
  }

  // Implement this method according to how you store the token
  private getAuthToken(): string | null {
    const authToken = localStorage.getItem('jhi-authenticationToken') ?? sessionStorage.getItem('jhi-authenticationToken');
    if (authToken) {
      return JSON.parse(authToken);
    }
    return null; // Or your preferred way to retrieve the token
  }

  // Handle API errors
  private handleError(error: any) {
    console.error('An error occurred:', error.error.message);
    return throwError(error);
  }
}
function switchMap(arg0: (contacts: any) => Observable<unknown>): import('rxjs').OperatorFunction<any, any[]> {
  throw new Error('Function not implemented.');
}
