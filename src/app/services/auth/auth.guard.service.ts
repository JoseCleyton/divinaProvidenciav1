import { CanActivate } from '@angular/router';
import { AuthLoginService } from './authLogin.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuardService implements CanActivate{
    constructor(private auth : AuthLoginService){}
    canActivate(): boolean {    
     return this.auth.isAuthenticated()
 }
}