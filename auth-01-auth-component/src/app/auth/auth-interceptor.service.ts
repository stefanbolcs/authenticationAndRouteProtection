import { Injectable } from '@angular/core';

import {HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private authService: AuthService){}

    // take(1) means we only wanna take one value from that observable  and it automatically unsubscribes
    //it means basically subscribe and then unsubscribe

    //exhasustMap take what previosly was take(1) and passes it (-> the user ) and replaces the observable it was piped from (-> the authservice observable)
    

    //intercepts all outgoing requests
    intercept(req: HttpRequest<any>, next: HttpHandler){
        return this.authService.user.pipe(
            take(1),
            exhaustMap(user=>{
                if(!user){
                    return next.handle(req);
                }
                //this is the observable it will replace the upper one
                const modifiedReq= req.clone({params: new HttpParams().set('auth', user.token)})
                return next.handle(req);
            })
        );
       
    }
}