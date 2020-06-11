import { Injectable } from '@angular/core';
import { Product } from 'src/app/model/produto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URLS } from '../urls'


Injectable()
export class EstoqueService {

    constructor(private http: HttpClient) { }

    public inserirNoEstoque(product: Product): Observable<Product> {

        return this.http.post<Product>(URLS.stock, product)
    }

    public getEstoque(): Observable<Product[]> {

        return this.http.get<Product[]>(URLS.stock)
    }
    public atualizarEstoque(products: Product[]): Observable<any[]> {
        return this.http.put<any[]>(`${URLS.stock}/updateStock`, products)
    }
    public atualizarProduto(product: Product): Observable<any> {
        return this.http.put<any[]>(URLS.stock, product)
    }
}