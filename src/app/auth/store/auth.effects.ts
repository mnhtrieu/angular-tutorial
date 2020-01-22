import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';


export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (email: string, userId: string, token: string, expiresIn: number) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({email: email, userId: userId, token: token, expirationDate: expirationDate, redirect: true});
};

const handleError = (error: any) => {
  let errorMessage = "An unknown error occured!";
  if(error.error && error.error.error){
    switch(error.error.error.message){
      case "EMAIL_EXISTS": errorMessage = "This email exists already!"; break;
      case "EMAIL_NOT_FOUND": errorMessage = "This email does not exist!"; break;
      case "INVALID_PASSWORD": errorMessage = "This password is not correct!"; break;
    }
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START, /* multiple actions  */),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.firebaseAPIKey, {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      })
      .pipe(
        tap(resData => {
          this.authService.setLogoutTimer(+resData.expiresIn*1000);
        }),
        map(resData => {
          return handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }),
        catchError(error => {
          return handleError(error);
        })
      )
    }),
  );

  @Effect({dispatch: false}) // doesnt yield any dispatch actions, therefore we have to inform it about not dispatching
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if(authSuccessAction.payload.redirect) this.router.navigate(['/']);
    })
  )

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.firebaseAPIKey,
      {
        email: signupAction.payload.email,
        password: signupAction.payload.password,
        returnSecureToken: true
      })
      .pipe(
        tap(resData => {
          this.authService.setLogoutTimer(+resData.expiresIn*1000);
        }),
        map(resData => {
          return handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }),
        catchError(error => {
          return handleError(error);
        })
      );
    })
  );

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {email: string, id: string, _token: string, _tokenExpirationDate: string} = JSON.parse(localStorage.getItem('userData'));
      if(!userData) return { type: 'DUMMY' };
      const user = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
      if(user.token) {
        const duration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(duration);
        // this.user.next(user);
        return new AuthActions.AuthenticateSuccess({
          email: user.email, 
          userId: user.id, 
          token: user.token, 
          expirationDate: new Date(userData._tokenExpirationDate), 
          redirect: false
        });
        // const duration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        // this.autoLogout(duration);
      }
      return { type: 'DUMMY' };
    })
  )

  // actions$ => convention for ngrx effects
  // one big observable to all dispatched actions so you can react to them
  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {

  }
}