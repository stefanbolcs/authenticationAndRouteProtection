import { Injectable } from "@angular/core";

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { User } from "./user.model";
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

@Injectable({ providedIn: "root" })
export class AuthService {
    //behaviour subject has state meaning subscribers can have access to previosly emited states, even if they subscribed later on
  user = new BehaviorSubject<User>(null);
  

  constructor(private http: HttpClient, private router:Router) {}

  //search in firebase rest api call
  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyAvrVvXu_a9DEo-XTE22X9onDE1t6f3dJo",
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(catchError(this.handleError));
  }

  //sign in with firebase rest api authentication
  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAvrVvXu_a9DEo-XTE22X9onDE1t6f3dJo",
        { email: email, password: password, returnSecureToken: true }
      ) //tap is just tapping into data using it but not interfering with the function chain
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  autoLogin(){
    const userData:{
      email:string;
      id:string;
      _token:string;
      _tokenExpirationDate:string;

    } = JSON.parse(localStorage.getItem('userData'));
    if(!userData){
      return;
    }

    const loadedUser = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate));

    //this is calling get token getter
    if(loadedUser.token){
      this.user.next(loadedUser);
    }

  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));

    this.user.next(user);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = "An unknown error occured!";
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage = "This email exists already";
        break;
      case "EMAIL_NOT_FOUND":
        errorMessage = "This email was not found!";
        break;
      case "INVALID_PASSWORD":
        errorMessage = "This password is not correct";
        break;
    }
    return throwError(errorMessage);
  }
}
