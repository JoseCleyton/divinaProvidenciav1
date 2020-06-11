import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountsReceivable } from 'src/app/model/accountsReceivable';
import { Observable } from 'rxjs';
import { URLS } from '../urls'

Injectable()
export class AccountsReceivableService {
    constructor(private http: HttpClient) { }

    public checkin(accountsReceivable: AccountsReceivable): Observable<any> {
        return this.http.post<any>(`${URLS.accountsReceivable}`, accountsReceivable)
    }
    public getAccounts(): Observable<AccountsReceivable[]> {
        return this.http.get<AccountsReceivable[]>(`${URLS.accountsReceivable}/opens`)
    }
    public getAllAccounts(): Observable<AccountsReceivable[]> {
        return this.http.get<AccountsReceivable[]>(URLS.accountsReceivable)
    }
    public checkOut(accountsReceivable: AccountsReceivable): Observable<any> {
        return this.http.put<any>(`${URLS.accountsReceivable}/checkout`, accountsReceivable)
    }
    public payInstallments(accountsReceivable: AccountsReceivable): Observable<any> {
        return this.http.put<any>(`${URLS.accountsReceivable}/payInstallments`, accountsReceivable)
    }
}