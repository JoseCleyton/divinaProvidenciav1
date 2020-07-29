import { Injectable } from '@angular/core';
import { MovimentacoesCaixa } from 'src/app/model/movimentacoesCaixa';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URLS } from '../urls'

Injectable()
export class MovesCashierService {

    constructor(private htpp: HttpClient) { }

    public movesCashier(moves: MovimentacoesCaixa): Observable<any> {

        let day = new Date().getDate();
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        let updatedDate = day + '/' + month + '/' + year;
        moves.date = updatedDate;

        return this.htpp.post<any>(URLS.reportCashier, moves)
    }

    public getMoves(): Observable<any[]> {
        return this.htpp.get<any[]>(URLS.reportCashier)
    }

    public movesCashierWithdraw(comments: string, valueWithdraw: number, valueinCash: number, type: string): Observable<any> {
        let moves: MovimentacoesCaixa = new MovimentacoesCaixa(comments, valueWithdraw, valueinCash, type);

        let day = new Date().getDate();
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        let updatedDate = day + '/' + month + '/' + year;
        moves.date = updatedDate;

        return this.htpp.post<any>(`${URLS.reportCashier}/withdrawValue`, moves)
    }

}