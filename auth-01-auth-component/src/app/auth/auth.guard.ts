import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate {
    constructor(private authService:AuthService, private router: Router){}                        // these are the return types they can be  boolean or UrlTree
    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot):| boolean | UrlTree | Promise<boolean | UrlTree>| Observable<boolean | UrlTree> {
        return this.authService.user.pipe(

            
    //         Useful Docs:

    // Firebase Auth REST API Docs: firebase.google.com/docs/reference/rest/auth

    // More on JWT: jwt.io

            //because here we will get constantly more users and cause side effect we have to only take the latest value
            take(1),
            map(user =>{


            //it will return true or false    depenging on user subject
            const isAuth = !!user;
            if(isAuth){
                return true;
            }
            return this.router.createUrlTree(['/auth']);
        }),
        // tap(isAuth=>{
        //     if(!isAuth){
        //         this.router.navigate(['/auth']);
        //     }
        // })
        );
    }

}