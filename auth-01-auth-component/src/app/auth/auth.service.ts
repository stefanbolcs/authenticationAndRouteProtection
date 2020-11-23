import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';




interface AuthResponseData {
kind: string;
idToken:string;
email: string;
refreshToken:string;
expiresIn:string;
localId:string;
}


@Injectable({providedIn:'root'})
export class AuthService {
    constructor(private http:HttpClient){}

   //search in firebase rest api call
    signup(email:string, password:string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyAvrVvXu_a9DEo-XTE22X9onDE1t6f3dJo',
        {email: email,
        password: password,
        returnSecureToken:true });
    }
}
