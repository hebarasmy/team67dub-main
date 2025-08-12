import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = 'api/user'; // Adjust the URL to your backend endpoint

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<any> {
    return this.http.get(this.userUrl);
  }

  updateUserProfile(userData: any): Observable<any> {
    return this.http.put(this.userUrl, userData);
  }
}
