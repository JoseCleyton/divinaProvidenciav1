import { Injectable } from '@angular/core';
import { Product } from 'src/app/model/produto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URLS } from '../urls'


Injectable()
export class StockService {

    constructor(private http: HttpClient) { }

    public insertInStock(product: Product): Observable<Product> {

        return this.http.post<Product>(URLS.stock, product)
    }

    public getStock(): Observable<Product[]> {

        return this.http.get<Product[]>(URLS.stock)
    }
    public updateStock(products: Product[]): Observable<any[]> {
        return this.http.put<any[]>(`${URLS.stock}/updateStock`, products)
    }
    public updateProduct(product: Product): Observable<any> {
        return this.http.put<any[]>(URLS.stock, product)
    }
}