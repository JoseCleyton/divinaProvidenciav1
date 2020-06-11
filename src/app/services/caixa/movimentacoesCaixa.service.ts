import { Injectable } from '@angular/core';
import { MovimentacoesCaixa } from 'src/app/model/movimentacoesCaixa';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URLS } from '../urls'

Injectable()
export class MovimentacoesCaixaService {

    constructor(private htpp: HttpClient) { }

    public movimentarCaixa(movimentacao: MovimentacoesCaixa): Observable<any> {

        let dia = new Date().getDate()
        let mes = new Date().getMonth() + 1
        let ano = new Date().getFullYear()
        let hora = new Date().getUTCMilliseconds()
        let dataAtualizada = dia + '/' + mes + '/' + ano
        movimentacao.date = dataAtualizada

        return this.htpp.post<any>(URLS.reportCashier, movimentacao)
    }

    public getMovimentacoes(): Observable<any[]> {
        return this.htpp.get<any[]>(URLS.reportCashier)
    }

    public movimentarCaixaRetirada(descricao: string, valorRetirada: number, valorNoCaixa: number, tipo: string): Observable<any> {
        let movimentacao: MovimentacoesCaixa = new MovimentacoesCaixa(descricao, valorRetirada, valorNoCaixa, tipo);

        let dia = new Date().getDate()
        let mes = new Date().getMonth() + 1
        let ano = new Date().getFullYear()
        let hora = new Date().getUTCMilliseconds()
        let dataAtualizada = dia + '/' + mes + '/' + ano

        movimentacao.date = dataAtualizada

        return this.htpp.post<any>(`${URLS.reportCashier}/withdrawValue`, movimentacao)
    }

}