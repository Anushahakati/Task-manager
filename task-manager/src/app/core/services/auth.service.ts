import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Placeholder login logic
  login(credentials: any): Observable<any> {
    console.log('AuthService: Logging in with', credentials);
    // Simulate an API call
    return of({ token: 'fake-jwt-token' }).pipe(
      delay(1000), // Simulate network latency
      tap(response => localStorage.setItem('token', response.token))
    );
  }

  // Placeholder register logic
  register(userInfo: any): Observable<any> {
    console.log('AuthService: Registering user', userInfo);
    // Simulate an API call
    return of({ success: true }).pipe(delay(1000));
  }
}