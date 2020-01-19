import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private timer: any;

  constructor(private http: HttpClient, private router: Router){ }

  signup(email: string, password: string){
    return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.firebaseAPIKey,
    {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(data => {
      this.handleAuthentication(data.email, data.localId, data.idToken, +data.expiresIn);
    }));
  }

  login(email: string, password: string){
    return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.firebaseAPIKey, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(data => {
      this.handleAuthentication(data.email, data.localId, data.idToken, +data.expiresIn);
    }));
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.timer){
      clearTimeout(this.timer);
    }
    this.timer = null;
  }

  autoLogin(){
    const userData: {email: string, id: string, _token: string, _tokenExpirationDate: string} = JSON.parse(localStorage.getItem('userData'));
    if(!userData) return;
    const user = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if(user.token) {
      this.user.next(user);
      const duration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(duration);
    }
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  autoLogout(expirationDuration: number){
    this.timer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(error: HttpErrorResponse){
    let errorMessage = "An unknown error occured!";
      if(error.error && error.error.error){
        switch(error.error.error.message){
          case "EMAIL_EXISTS": errorMessage = "This email exists already!"; break;
          case "EMAIL_NOT_FOUND": errorMessage = "This email does not exist!"; break;
          case "INVALID_PASSWORD": errorMessage = "This password is not correct!"; break;
        }
      }
      return throwError(errorMessage);
  }
}