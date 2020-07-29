import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { URLS } from '../urls'

@Injectable()
export class CashierService {
    
    constructor(private http: HttpClient) { }

    public insertvalueInCash(value: number): Observable<any> {
        return this.http.post<any>(URLS.cashier, value)

    }
    public withdrawCashAmount(value: number): Observable<any> {
        return this.http.post<any>(`${URLS.cashier}/withdrawValue`, value)

    }

    public getCashValue(): Observable<any> {
        return this.http.get<any>(URLS.cashier)

    }

}