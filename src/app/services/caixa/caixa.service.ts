import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { URLS } from '../urls'

@Injectable()
export class CaixaService {
    
    constructor(private http: HttpClient) { }

    public inserirValorNoCaixa(value: number): Observable<any> {
        return this.http.post<any>(URLS.cashier, value)

    }
    public retirarValorDoCaixa(value: number): Observable<any> {
        return this.http.post<any>(`${URLS.cashier}/withdrawValue`, value)

    }

    public getValorCaixa(): Observable<any> {
        return this.http.get<any>(URLS.cashier)

    }

}