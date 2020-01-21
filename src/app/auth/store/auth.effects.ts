import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

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
        map(resData => {
          const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          return new AuthActions.Login({email: resData.email, userId: resData.localId, token: resData.idToken, expirationDate: expirationDate});
        }),
        catchError(error => {
          let errorMessage = "An unknown error occured!";
          if(error.error && error.error.error){
            switch(error.error.error.message){
              case "EMAIL_EXISTS": errorMessage = "This email exists already!"; break;
              case "EMAIL_NOT_FOUND": errorMessage = "This email does not exist!"; break;
              case "INVALID_PASSWORD": errorMessage = "This password is not correct!"; break;
            }
          }
        return of(new AuthActions.LoginFail(errorMessage));
        })
      )
    }),
  );

  @Effect({dispatch: false}) // doesnt yield any dispatch actions, therefore we have to inform it about not dispatching
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => {
      this.router.navigate(['/']);
    })
  )
  // actions$ => convention for ngrx effects
  // one big observable to all dispatched actions so you can react to them
  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {

  }
}